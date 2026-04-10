import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Owner } from 'src/app/models/owner';
import { Organization } from 'src/app/models/organization';
import { Service } from 'src/app/models/service';
import { CalendarEvent } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = 'http://localhost:8080/owner';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // POST /owner/register
  register(owner: { firstName: string; lastName: string; email: string; password: string; phoneNumber: string; handle: string; address: string; birthday: string }): Observable<Owner | null> {
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

  // PUT /owner/profile — update editable profile fields
  updateProfile(data: { firstName: string; lastName: string; email: string; phoneNumber: string; address: string }): Observable<Owner> {
    return this.http.put<Owner>(`${this.apiUrl}/profile`, data, this.options);
  }

  // GET /owner/favorites — get favorite organizations
  getFavoriteOrgs(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/favorites`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /owner/favorite/{orgId} — add org to favorites
  addFavoriteOrg(orgId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/favorite/${orgId}`, {}, this.options);
  }

  // DELETE /owner/favorite/{orgId} — remove org from favorites
  removeFavoriteOrg(orgId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorite/${orgId}`, this.options);
  }

  // GET /owner/my-events — all events tied to owner's dogs
  getMyEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/my-events`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/org/{orgId} — get a single org by id (for customer-facing profile)
  getOrgById(orgId: number): Observable<Organization | null> {
    return this.http.get<Organization>(`${this.apiUrl}/org/${orgId}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /owner/search-orgs/name?name= — search organizations by name
  searchOrgsByName(name: string): Observable<Organization[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Organization[]>(`${this.apiUrl}/search-orgs/name`, { ...this.options, params }).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/search-orgs/service?service= — search organizations by service name
  searchOrgsByService(serviceName: string): Observable<Organization[]> {
    const params = new HttpParams().set('service', serviceName);
    return this.http.get<Organization[]>(`${this.apiUrl}/search-orgs/service`, { ...this.options, params }).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/org/{orgId}/services — get all services offered by an org
  getOrgServices(orgId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/org/${orgId}/services`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/org/{orgId}/mean-rating — get mean review rating (1 decimal place, computed on backend)
  getOrgMeanRating(orgId: number): Observable<number | null> {
    return this.http.get<number>(`${this.apiUrl}/org/${orgId}/mean-rating`, this.options).pipe(
      catchError(() => of(null))
    );
  }
}
