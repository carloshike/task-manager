import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class PermissionService {

    constructor(
        private http: HttpClient,
    ) { }

    API_URL = "accounts/oauth/token?grant_type=password&response_type=token&client_id=demo&username=carlos.correa@desafiofluig.com&password=Carlos@123";

    public getToken() {
        const headers = new HttpHeaders().set('Authorization', 'Basic ZGVtbzpzU2R4T1lEQU0zRkJO');
        

        return this.http.post<any>(this.API_URL, {}, { headers });
    }
}