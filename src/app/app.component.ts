import { Component, OnInit, ViewChild } from '@angular/core';
import { PermissionService } from './features/permission/permission.service';
import { ListService } from './features/list/list.service';
import { List } from './features/list/list.model';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  token: string;

  constructor(
    private permissionService: PermissionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.permissionService.getToken().subscribe((data: any) => {
      this.token = data.access_token;
    });

    setInterval(() => {
      this.resetPermissionToken();
    }, 1140000)
  }

  private resetPermissionToken() {
    this.permissionService.getToken().subscribe((data: any) => {
      this.token = data.access_token;
    });
  }
}
