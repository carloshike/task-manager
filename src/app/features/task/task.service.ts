import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { List, ListAdapter } from '../list/list.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TaskService {
    API_URL: string = "tasks/api/v2/lists"

    constructor(
        private http: HttpClient,
        private listAdapter: ListAdapter
    ) { }


    public createTask(token: string, listId: string, name: string, description: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = {
            "name": name,
            "description": description,
        }
        
        return this.http.post<any>(`${this.API_URL}/${listId}/tasks?expand=status`, params, { headers });
    }

    public updateTask(token: string, listId: string, id: string, name: string, description: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = [ 
            { "op": "replace", "path": "/name", "value": name }, 
            { "op": "replace", "path": "/description", "value": description }
        ]
        
        return this.http.patch<any>(`${this.API_URL}/${listId}/tasks/${id}?expand=status`, params, { headers });
    }

    public updateTaskStatus(token: string, listId: string, id: string, statusId: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = [ { "op": "replace", "path": "/statusId", "value": statusId }]
        
        return this.http.patch<any>(`${this.API_URL}/${listId}/tasks/${id}`, params, { headers });
    }

    public deleteTask(token: string, listId: string, id: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.delete<any>(`${this.API_URL}/${listId}/tasks/${id}`, { headers });
    }
}