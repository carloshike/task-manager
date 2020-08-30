import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { List } from '../list/list.model';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'task',
    templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
    @ViewChild('taskClosebutton') taskClosebutton;
    @Input() token: string;
    @Input() list: List;
    taskForm: FormGroup;
    submited: boolean = false;
    taskToDelete: Task;

    constructor(
        private taskService: TaskService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.taskForm = this.buildTaskForm();
    }

    private buildTaskForm() {
        const formGroup = this.formBuilder.group({
            id: [{ value: undefined, disabled: false }, Validators.compose([])],
            name: [{ value: undefined, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(255)])],
            description: [{ value: undefined, disabled: false }, Validators.compose([Validators.required])]
        });

        return formGroup;
    }

    public createUpdateTask() {
        this.submited = true;
        if (!this.taskForm.valid) {
            return this.validateAllFormFields(this.taskForm);
        }

        this.taskClosebutton.nativeElement.click();
        this.spinner.show();

        if (this.taskForm.controls.id.value) {
            this.taskService.updateTask(this.token, this.list.id, this.taskForm.controls.id.value, this.taskForm.controls.name.value, this.taskForm.controls.description.value).subscribe((data: any) => {       
                this.list.tasks[this.list.tasks.findIndex(x => x.id == this.taskForm.controls.id.value)] = data;
                this.submited = false;
                this.taskForm.reset();
                this.spinner.hide();
            });
        } else {
            this.taskService.createTask(this.token, this.list.id, this.taskForm.controls.name.value, this.taskForm.controls.description.value).subscribe((data: any) => {
                this.list.tasks ? this.list.tasks.unshift(data) : this.list.tasks = [data];
                this.submited = false;
                this.taskForm.reset();
                this.spinner.hide();
            });
        }
    }

    public editTask(task: Task) {
        this.taskForm.patchValue(task);
    }

    public deleteTask() {
        this.spinner.show();
        this.taskService.deleteTask(this.token, this.list.id, this.taskToDelete.id).subscribe((data: any) => {
            this.list.tasks = this.list.tasks.filter(x => x.id != this.taskToDelete.id);
            this.taskToDelete = null;
            this.spinner.hide();
        });
    }

    public markToDeleteTask(task: Task) {
        this.taskToDelete = task;
    }

    public updateTaskStatus(status: string, taskId: string) {
        const statusId = this.list.status.find(s => s.statusType == status).id;

        this.taskService.updateTaskStatus(this.token, this.list.id, taskId, statusId).subscribe((data: any) => {
            this.list.tasks.find(t => t.id == taskId).status = this.list.status.find(s => s.id == data.statusId);
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
