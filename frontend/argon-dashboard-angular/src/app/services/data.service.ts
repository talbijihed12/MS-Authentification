import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiServiceUrl=environment.apiBaseUrl1;


  constructor(private http:HttpClient) { }
  data(): Observable<any> {
    return this.http.get<any>(`${this.apiServiceUrl}/data`);
  }
}
