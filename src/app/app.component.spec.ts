import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PermissionService } from './features/permission/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './features/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ListService } from './features/list/list.service';
import { TaskService } from './features/task/task.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        ReactiveFormsModule
      ],
      declarations: [
        AppComponent,
        ListComponent,
        AppComponent
      ],
      providers: [
        PermissionService,
        ListService,
        TaskService,
      ]
    }).compileComponents();
  }));

  it('Deve criar o componente app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
