import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from '../list/list.component';
import { TaskComponent } from './task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionService } from '../permission/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ListService } from '../list/list.service';
import { TaskService } from './task.service';
import { of } from 'rxjs';

const dummyCreateTasktReturn = {id: "create", name: "create", description: "create", statusId: "id", status: null, createDate: null};
const dummyUpdateTaskReturn = {id: "update", name: "update", description: "update", statusId: "id", status: null, createDate: null};

class FakeTaskSerivce {
    createTask(a: any, b: any, c: any, d: any) {
      return of(dummyCreateTasktReturn);
    }
  
    updateTask(a: any, b: any, c: any, d: any, e: any) {
      return of(dummyUpdateTaskReturn);
    }
  }

describe('TaskComponent', () => {
    let component: TaskComponent;
    let fixture: ComponentFixture<TaskComponent>;

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
                TaskComponent,
                AppComponent
              ],
              providers: [
                PermissionService,
                ListService,
                {provide: TaskService, useClass: FakeTaskSerivce}
              ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskComponent);
        component = fixture.componentInstance;
    });

    it('Deve criar o componente list', () => {
        expect(component).toBeTruthy();
    });

    it('Deve validar a presença dos campos do formulário de tarefa', () => {
        component.taskForm = component['buildTaskForm']();
        expect(component.taskForm.controls.name.errors.required).toBeTruthy();
        expect(component.taskForm.controls.description.errors.required).toBeTruthy();

        component.taskForm.get('name').setValue("nome");
        component.taskForm.get('description').setValue("descrição");

        expect(component.taskForm.controls.name.errors).toBeNull();
        expect(component.taskForm.controls.description.errors).toBeNull();
    });

    it('Deve validar a quantidade de caracteres do campo nome do formulário de tarefa', () => {
        component.taskForm = component['buildTaskForm']();
        component.taskForm.get('name').setValue("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor ante id tempor varius. Nunc sem tellus, convallis at mattis eu, vestibulum ut purus. Pellentesque enim enim, imperdiet nec rhoncus ac, lobortis id risus. Vivamus commodo urna odio.");
        component.taskForm.get('description').setValue("descrição");

        expect(component.taskForm.controls.name.errors.maxlength).toBeTruthy();

        component.taskForm.get('name').setValue("nome");

        expect(component.taskForm.controls.name.errors).toBeNull();
    });

    it('Deve chamar o serviço de criação de tarefa', () => {
        component.list = {id: "create", name: "create", description: "create", tasks: [], status: []};
        component.taskForm = component['buildTaskForm']();
        component.taskForm.get('name').setValue("nome");
        component.taskForm.get('description').setValue("descrição");

        component.createUpdateTask();
        expect(component.list.tasks[0].id).toBe("create");
    });

    it('Deve chamar o serviço de atualização de tarefa', () => {
        component.list = {id: "create", name: "create", description: "create", tasks: [], status: []};
        component.list.tasks = [{id: "update", name: "deve atualizar este nome", description: "update", statusId: "id", status: null, createDate: null}];
        component.taskForm = component['buildTaskForm']();
        component.taskForm.get('id').setValue("update");
        component.taskForm.get('name').setValue("nome");
        component.taskForm.get('description').setValue("descrição");

        component.createUpdateTask();
        expect(component.list.tasks[0].name).toBe("update");
    });
});