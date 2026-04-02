import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Organization } from 'src/app/models/organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private apiUrl = 'http://localhost:8080/organization';

  // withCredentials must be true on every request so the browser
  // includes the session cookie that Spring sets on login.
  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Organization | null> {
    return this.http.post<Organization>(`${this.apiUrl}/login`, { email, password }, this.options).pipe(
      catchError(() => of(null))
    );
  }

  getSession(): Observable<Organization | null> {
    return this.http.get<Organization>(`${this.apiUrl}/session`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, this.options);
  }

  register(org: Organization): Observable<Organization | null> {
    return this.http.post<Organization>(`${this.apiUrl}/register`, org, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // -- AWS EKS reference (for future deployment) --
  // private apiUrl = (window as any)._env_.LOAD_BALANCER_URL;

}
