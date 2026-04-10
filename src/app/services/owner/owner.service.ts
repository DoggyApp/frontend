import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Owner } from 'src/app/models/owner';
import { Organization } from 'src/app/models/organization';
import { CalendarEvent } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = 'http://localhost:8080/owner';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // POST /owner/register
  register(owner: { firstName: string; lastName: string; email: string; password: string; phoneNumber: string; handle: string }): Observable<Owner | null> {
    return this.http.post<Owner>(`${this.apiUrl}/register`, owner, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /owner/handle-check?handle= — returns true if taken, false if available
  checkHandle(handle: string): Observable<boolean> {
    const params = new HttpParams().set('handle', handle);
    return this.http.get<boolean>(`${this.apiUrl}/handle-check`, { ...this.options, params });
  }

  login(email: string, password: string): Observable<Owner | null> {
    return this.http.post<Owner>(`${this.apiUrl}/login`, { email, password }, this.options).pipe(
      catchError(() => of(null))
    );
  }

  getSession(): Observable<Owner | null> {
    return this.http.get<Owner>(`${this.apiUrl}/session`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, this.options);
  }

  // GET /owner/nearby-orgs?lat=&lng=&miles=
  getNearbyOrganizations(lat: number, lng: number, miles: number): Observable<Organization[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('miles', miles.toString());
    return this.http.get<Organization[]>(`${this.apiUrl}/nearby-orgs`, { ...this.options, params });
  }

  // GET /owner/nearby-events?lat=&lng=&miles=
  getNearbyEvents(lat: number, lng: number, miles: number): Observable<CalendarEvent[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('miles', miles.toString());
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/nearby-events`, { ...this.options, params });
  }

  // GET /owner/friends
  getFriends(): Observable<Owner[]> {
    return this.http.get<Owner[]>(`${this.apiUrl}/friends`, this.options);
  }

  // POST /owner/friend/{ownerId}
  addFriend(ownerId: number): Observable<Owner> {
    return this.http.post<Owner>(`${this.apiUrl}/friend/${ownerId}`, {}, this.options);
  }

  // DELETE /owner/friend/{ownerId}
  removeFriend(ownerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/friend/${ownerId}`, this.options);
  }

  // GET /owner/search?handle= — find owner by unique handle
  searchOwners(handle: string): Observable<Owner[]> {
    const params = new HttpParams().set('handle', handle);
    return this.http.get<Owner[]>(`${this.apiUrl}/search`, { ...this.options, params });
  }
}
