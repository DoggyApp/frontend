import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public apiUrl: String = (window as any)._env_.LOAD_BALANCER_URL; 
  constructor(private http:HttpClient) { }

  getTestValue(): Observable<String> {
    console.log("inside get test value..."); 
    console.log(this.apiUrl); 
    return this.http.get(
      `${this.apiUrl}/api/registry/test`,
      { responseType: 'text' });
  }

  getBackendErrorTestValue(): Observable<String> {
    console.log("inside get backend error test value...");
    console.log(this.apiUrl); 
    return this.http.get(
      `${this.apiUrl}/api/registry/error-test`,
      { responseType: 'text' });
  }
}
