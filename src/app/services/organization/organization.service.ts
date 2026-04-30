import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Organization } from 'src/app/models/organization';
import { Dog } from 'src/app/models/dog';
import { RegistrationRequest } from 'src/app/models/registration-request';
import { Note } from 'src/app/models/Note';
import { Alert } from 'src/app/models/alert';
import { Like } from 'src/app/models/like';
import { Vaccine } from 'src/app/models/vaccine';
import { CalendarEvent } from 'src/app/models/event';
import { Location } from 'src/app/models/location';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private apiUrl = environment.orgApiUrl;

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

  updateProfile(name: string, email: string): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/profile`, { name, email }, this.options);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/password`, { oldPassword, newPassword }, this.options);
  }

  renew(): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/renew`, {}, this.options);
  }

  // ── Dog methods ───────────────────────────────────────

  // GET /organization/dogs
  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /organization/dog/{id}
  getDogById(id: number): Observable<Dog | null> {
    return this.http.get<Dog>(`${this.apiUrl}/dog/${id}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // POST /organization/dog/add
  addDog(dog: { name: string; breed: string; birthday: string; weight: number; image: string }, bordetellaDate: string, rabiesDate: string): Observable<Dog> {
    const params = new HttpParams()
      .set('bordetellaDate', bordetellaDate)
      .set('rabiesDate', rabiesDate);
    return this.http.post<Dog>(`${this.apiUrl}/dog/add`, dog, { ...this.options, params });
  }

  // DELETE /organization/dog/{id}
  deleteDog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dog/${id}`, this.options);
  }

  // ── Event methods ─────────────────────────────────────────────────────────

  // GET /organization/event/dog/{dogId}
  getEventsByDog(dogId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/event/dog/${dogId}`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /organization/event/location/{locationId}
  getEventsByLocation(locationId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/event/location/${locationId}`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /organization/event/user/{userId}
  getEventsByUser(userId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/event/user/${userId}`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // ── Location methods ──────────────────────────────────────────────────────

  // GET /organization/locations
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /organization/location/add
  addLocation(name: string, address: string): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/location/add`, { name, address, offsite: false }, this.options);
  }

  // DELETE /organization/location/{id}
  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/location/${id}`, this.options);
  }

  // ── User management ───────────────────────────────────────────────────────

  // POST /organization/user/add
  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/add`, user, this.options);
  }

  // DELETE /organization/user/{id}
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`, this.options);
  }

  // ── Registration Requests ─────────────────────────────────────────────────

  // GET /organization/registration-requests/pending
  getPendingRegistrationRequests(): Observable<RegistrationRequest[]> {
    return this.http.get<RegistrationRequest[]>(`${this.apiUrl}/registration-requests/pending`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /organization/registration-request/{requestId}/accept
  acceptRegistrationRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registration-request/${requestId}/accept`, {}, this.options);
  }

  // POST /organization/registration-request/{requestId}/reject
  rejectRegistrationRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registration-request/${requestId}/reject`, {}, this.options);
  }

  // -- AWS EKS reference (for future deployment) --
  // private apiUrl = (window as any)._env_.LOAD_BALANCER_URL;

}
