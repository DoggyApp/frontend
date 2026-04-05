import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/user';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`, this.options);
  }

  getUsersById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }, this.options).pipe(
      catchError(() => of(null))
    );
  }

  getSession(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/session`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, this.options);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/password`, { oldPassword, newPassword }, this.options);
  }

  register(newUser: Omit<User, 'id'>): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/register`, newUser, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // Organization session required
  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add`, user, this.options);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.options);
  }

  // -- AWS EKS reference (for future deployment) --
  // public apiUrl: String = (window as any)._env_.LOAD_BALANCER_URL;

  // getTestValue(): Observable<String> {
  //   console.log("inside get test value...");
  //   console.log(this.apiUrl);
  //   return this.http.get(
  //     `${this.apiUrl}/registry/test`,
  //     { responseType: 'text' });
  // }

  // getBackendErrorTestValue(): Observable<String> {
  //   console.log("inside get backend error test value...");
  //   console.log(this.apiUrl);
  //   return this.http.get(
  //     `${this.apiUrl}/registry/error-test`,
  //     { responseType: 'text' });
  // }

}
