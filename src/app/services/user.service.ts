import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public backendUrl: String = "http://localhost:8080/" 
  constructor(private http:HttpClient) { }

  getTestValue(): Observable<String> {
    console.log("inside get test value..."); 
    return this.http.get(
      "http://registry-service:8080", 
      { responseType: 'text' });
  }
}
