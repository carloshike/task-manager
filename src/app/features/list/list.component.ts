import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { ListService } from './list.service';
import { List } from './list.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnChanges {
    @ViewChild('listClosebutton') listClosebutton;
    @Input() token: string;
    lists: List[];
    listToDelete: List;
    listForm: FormGroup;
    submited: boolean = false;
    hasStarted: boolean = false;

    constructor(
        private listService: ListService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.listForm = this.buildListForm();
    }

    ngOnChanges() {
        if (!this.hasStarted && this.token) {
            this.hasStarted = true;
            this.getLists();
        }
    }

    private buildListForm() {
        const formGroup = this.formBuilder.group({
            id: [{ value: undefined, disabled: false }, Validators.compose([])],
            name: [{ value: undefined, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(255)])],
            description: [{ value: undefined, disabled: false }, Validators.compose([Validators.required])]
        });

        return formGroup;
    }

    private getLists() {
        this.listService.getLists(this.token).subscribe((data: any) => {
            this.lists = data;
            this.spinner.hide();
        });
    }

    public createUpdateList() {
        this.submited = true;
        if (!this.listForm.valid) {
            return this.validateAllFormFields(this.listForm);
        }

        this.listClosebutton.nativeElement.click();
        this.spinner.show();

        if (this.listForm.controls.id.value) {
            this.listService.updateList(this.token, this.listForm.controls.id.value, this.listForm.controls.name.value, this.listForm.controls.description.value).subscribe((data: any) => {       
                this.lists[this.lists.findIndex(x => x.id == this.listForm.controls.id.value)] = data;
                this.submited = false;
                this.listForm.reset();
                this.spinner.hide();
            });
        } else {
            this.listService.createList(this.token, this.listForm.controls.name.value, this.listForm.controls.description.value).subscribe((data: any) => {
                this.lists.unshift(data);
                this.submited = false;
                this.listForm.reset();
                this.spinner.hide();
            });
        }
    }

    public editList(list: List) {
        this.listForm.patchValue(list);
    }

    public deleteList() {
        this.spinner.show();
        this.listService.deleteList(this.token, this.listToDelete.id).subscribe((data: any) => {
            this.lists = this.lists.filter(x => x.id != this.listToDelete.id);
            this.listToDelete = null;
            this.spinner.hide();
        });
    }

    public markToDeleteList(list: List) {
        this.listToDelete = list;
    }

    private validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) control.markAsDirty({ onlySelf: true });
            else if (control instanceof FormGroup) this.validateAllFormFields(control);
        });
    }
}
