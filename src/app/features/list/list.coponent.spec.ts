import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from './list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionService } from '../permission/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ListService } from './list.service';
import { TaskService } from '../task/task.service';
import { of } from 'rxjs';

const dummyCreateListReturn = {id: "create", name: "create", description: "create", tasks: [], status: []};
const dummyUpdateListReturn = {id: "update", name: "update", description: "update", tasks: [], status: []};

class FakeListSerivce {
    createList(a: any, b: any, c: any) {
      return of(dummyCreateListReturn);
    }
  
    updateList(a: any, b: any, c: any, d: any) {
      return of(dummyUpdateListReturn);
    }
  }

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

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
                {provide: ListService, useClass: FakeListSerivce},
                TaskService,
              ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
    });

    it('Deve criar o componente list', () => {
        expect(component).toBeTruthy();
    });

    it('Deve validar a presença dos campos do formulário de lista', () => {
        component.listForm = component['buildListForm']();
        expect(component.listForm.controls.name.errors.required).toBeTruthy();
        expect(component.listForm.controls.description.errors.required).toBeTruthy();

        component.listForm.get('name').setValue("nome");
        component.listForm.get('description').setValue("descrição");

        expect(component.listForm.controls.name.errors).toBeNull();
        expect(component.listForm.controls.description.errors).toBeNull();
    });

    it('Deve validar a quantidade de caracteres do campo nome do formulário de lista', () => {
        component.listForm = component['buildListForm']();
        component.listForm.get('name').setValue("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor ante id tempor varius. Nunc sem tellus, convallis at mattis eu, vestibulum ut purus. Pellentesque enim enim, imperdiet nec rhoncus ac, lobortis id risus. Vivamus commodo urna odio.");
        component.listForm.get('description').setValue("descrição");

        expect(component.listForm.controls.name.errors.maxlength).toBeTruthy();

        component.listForm.get('name').setValue("nome");

        expect(component.listForm.controls.name.errors).toBeNull();
    });

    it('Deve chamar o serviço de criação de lista', () => {
        component.lists = [];
        component.listForm = component['buildListForm']();
        component.listForm.get('name').setValue("nome");
        component.listForm.get('description').setValue("descrição");

        component.createUpdateList();
        expect(component.lists[0].id).toBe("create");
    });

    it('Deve chamar o serviço de atualização de lista', () => {
        component.lists = [{id: "update", name: "deve atualizar este nome", description: "update", tasks: [], status: []}];
        component.listForm = component['buildListForm']();
        component.listForm.get('id').setValue("update");
        component.listForm.get('name').setValue("nome");
        component.listForm.get('description').setValue("descrição");

        component.createUpdateList();
        expect(component.lists[0].name).toBe("update");
    });
});