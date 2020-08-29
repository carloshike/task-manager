import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionService } from './services/permission.service';
import { ListService } from './services/list.service';
import { List } from './models/list.model';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('listClosebutton') listClosebutton;
  token: string;
  lists: List[];
  listForm: FormGroup;
  submited: boolean = false;

  constructor(
    private permissionService: PermissionService,
    private listService: ListService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.permissionService.getToken().subscribe((data: any) => {
      this.token = data.access_token;
      this.getLists();
    });

    setInterval(() => {
      this.resetPermissionToken();
    }, 1140000)

    this.listForm = this.buildListForm();
  }

  private buildListForm() {
      const formGroup = this.formBuilder.group({
        id: [{ value: undefined, disabled: false }, Validators.compose([])],
        name: [{ value: undefined, disabled: false }, Validators.compose([Validators.required])],
        description: [{ value: undefined, disabled: false }, Validators.compose([Validators.required])]
    });

    return formGroup;
  }

  private getLists() {
    this.listService.getLists(this.token).subscribe((data: any) => {
      this.lists = data;
    });
  }

  public createUpdateList() {
    this.submited = true;
    if (!this.listForm.valid) {
        return this.validateAllFormFields(this.listForm);
    }

    if (this.listForm.controls.id.value) {
      this.listService.updateList(this.token, this.listForm.controls.id.value, this.listForm.controls.name.value, this.listForm.controls.description.value).subscribe((data: any) => {       
        this.lists[this.lists.findIndex(x => x.id == this.listForm.controls.id.value)] = data;
        this.submited = false;
        this.listForm.reset();
        this.listClosebutton.nativeElement.click();
      });
    } else {
      this.listService.createList(this.token, this.listForm.controls.name.value, this.listForm.controls.description.value).subscribe((data: any) => {
        this.lists.unshift(data);
        this.submited = false;
        this.listForm.reset();
        this.listClosebutton.nativeElement.click();
      });
    }
  }

  public editList(list: List) {
    this.listForm.patchValue(list);
  }

  public deleteList(list: List) {
    this.listService.deleteList(this.token, list.id).subscribe((data: any) => {
      this.lists = this.lists.filter(x => x.id != list.id);
    });
  }

  private resetPermissionToken() {
    this.permissionService.getToken().subscribe((data: any) => {
      this.token = data.access_token;
    });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) control.markAsDirty({ onlySelf: true });
        else if (control instanceof FormGroup) this.validateAllFormFields(control);
    });
  }
}
