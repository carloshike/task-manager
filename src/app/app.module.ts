import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'

import { PermissionService } from './features/permission/permission.service';
import { ListService } from './features/list/list.service';
import { ListComponent } from './features/list/list.component';
import { TaskService } from './features/task/task.service';
import { TaskComponent } from './features/task/task.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [
    PermissionService,
    ListService,
    TaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
