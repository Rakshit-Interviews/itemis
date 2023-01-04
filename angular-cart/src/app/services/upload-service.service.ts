import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item, url } from '../classes/app.constant';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(private http: HttpClient) { }

    uploadData(file: any) {
        const formData = new FormData();
        formData.append('file', file, "customfile.csv");
        return this.http.post(url + 'files', formData)
    }

    getAllItems(): Observable<any> {
        return this.http.get<any>(url + 'items')
    }
}
