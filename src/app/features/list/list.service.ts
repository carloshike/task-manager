import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { List, ListAdapter } from './list.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ListService {
    adminId: string = "d2eba2eee7bb11ea914c0a5864601f8f";
    tenantId: string = "0b2a7d04c86411eab7360a5864604348";
    API_URL: string = "tasks/api/v2/lists"

    constructor(
        private http: HttpClient,
        private listAdapter: ListAdapter
    ) { }


    public getLists(token: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.get<any>(`${this.API_URL}?authorId=${this.adminId}&order=createDate&expand=tasks&expand=status`, { headers }).pipe(
            map((data: any) => data.items.sort().reverse().map(item => this.listAdapter.adapt(item)))
          );
    }

    public createList(token: string, name: string, description: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = {
            "adminId": this.adminId,
            "description": description,
            "name": name,
            "tenantId": this.tenantId
        }
        
        return this.http.post<any>(`${this.API_URL}?expand=status`, params, { headers });
    }

    public updateList(token: string, id: string, name: string, description: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = {
            "description": description,
            "name": name,
        }
        
        return this.http.put<any>(`${this.API_URL}/${id}?expand=tasks&expand=status`, params, { headers }).pipe(
            map((data: any) =>  this.listAdapter.adapt(data))
        );
    }

    public deleteList(token: string, id: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.delete<any>(`${this.API_URL}/${id}`, { headers });
    }
}