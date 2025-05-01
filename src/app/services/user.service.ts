import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public backendUrl: String = "http://a368138a48d444b79b20bcbb219f9d0b-328955209.us-east-1.elb.amazonaws.com/" 
  constructor(private http:HttpClient) { }

  getTestValue(): Observable<String> {
    console.log("inside get test value..."); 
    return this.http.get(
      `${this.backendUrl}/api/registry/test`,
      { responseType: 'text' });
  }
}
