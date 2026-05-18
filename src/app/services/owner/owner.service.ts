import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Owner } from 'src/app/models/owner';
import { OwnerPublicSearch, OwnerPublicFriend } from 'src/app/models/owner-public';
import { OrgPublic } from 'src/app/models/org-public';
import { Service } from 'src/app/models/service';
import { CalendarEvent } from 'src/app/models/event';
import { Dog } from 'src/app/models/dog';
import { Note } from 'src/app/models/Note';
import { Alert } from 'src/app/models/alert';
import { Like } from 'src/app/models/like';
import { Vaccine } from 'src/app/models/vaccine';
import { FriendRequest } from 'src/app/models/friend-request';
import { RegistrationRequest } from 'src/app/models/registration-request';
import { EventInvitation } from 'src/app/models/event-invitation';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = environment.ownerApiUrl;

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // ── Auth ──────────────────────────────────────────────────────────────────

  // POST /owner/register
  register(owner: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    handle: string;
    address: string;
    birthday: string;
    latitude?: number;
    longitude?: number;
  }): Observable<Owner | null> {
    return this.http.post<Owner>(`${this.apiUrl}/register`, owner, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /owner/handle-check?handle= — returns true if taken, false if available
  checkHandle(handle: string): Observable<boolean> {
    const params = new HttpParams().set('handle', handle);
    return this.http.get<boolean>(`${this.apiUrl}/handle-check`, { ...this.options, params });
  }

  // POST /owner/login
  login(email: string, password: string): Observable<Owner | null> {
    return this.http.post<Owner>(`${this.apiUrl}/login`, { email, password }, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /owner/session
  getSession(): Observable<Owner | null> {
    return this.http.get<Owner>(`${this.apiUrl}/session`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // POST /owner/logout
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, this.options);
  }

  // ── Profile ───────────────────────────────────────────────────────────────

  // PUT /owner/profile
  updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  }): Observable<Owner> {
    return this.http.put<Owner>(`${this.apiUrl}/profile`, data, this.options);
  }

  // PUT /owner/password
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/password`, { oldPassword, newPassword }, this.options);
  }

  // ── Search ────────────────────────────────────────────────────────────────

  // GET /owner/search?handle=
  // Returns minimal public info — enough to identify and send a friend request.
  searchOwners(handle: string): Observable<OwnerPublicSearch | null> {
    const params = new HttpParams().set('handle', handle);
    return this.http.get<OwnerPublicSearch>(`${this.apiUrl}/search`, { ...this.options, params }).pipe(
      catchError(() => of(null))
    );
  }

  // ── Dogs ──────────────────────────────────────────────────────────────────

  // POST /owner/dog/add
  // vaccines is optional — each entry needs name and vaccinatedDate; expiration is computed server-side.
  addDog(
    dog: { name: string; breed: string; birthday: string; weight: number; image: string },
    vaccines: { name: string; vaccinatedDate: string }[] = []
  ): Observable<Dog> {
    return this.http.post<Dog>(`${this.apiUrl}/dog/add`, { ...dog, vaccines }, this.options);
  }

  // PUT /owner/dog/{id}
  updateDog(dogId: number, updates: Partial<{ name: string; breed: string; birthday: string; weight: number; image: string }>): Observable<Dog> {
    return this.http.put<Dog>(`${this.apiUrl}/dog/${dogId}`, updates, this.options);
  }

  // GET /owner/dogs — returns only dogs belonging to the session owner
  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/dog/{id}
  getDogById(id: number): Observable<Dog | null> {
    return this.http.get<Dog>(`${this.apiUrl}/dog/${id}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // DELETE /owner/dog/{id}
  deleteDog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dog/${id}`, this.options);
  }

  // ── Notes ─────────────────────────────────────────────────────────────────

  addNote(dogId: number, text: string): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/dog/${dogId}/note`, { note: text }, this.options);
  }

  updateNote(dogId: number, noteId: number, text: string): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/dog/${dogId}/note/${noteId}`, { note: text }, this.options);
  }

  deleteNote(dogId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dog/${dogId}/note/${noteId}`, this.options);
  }

  // ── Alerts ────────────────────────────────────────────────────────────────

  addAlert(dogId: number, text: string): Observable<Alert> {
    return this.http.post<Alert>(`${this.apiUrl}/dog/${dogId}/alert`, { alert: text }, this.options);
  }

  updateAlert(dogId: number, alertId: number, text: string): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/dog/${dogId}/alert/${alertId}`, { alert: text }, this.options);
  }

  deleteAlert(dogId: number, alertId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dog/${dogId}/alert/${alertId}`, this.options);
  }

  // ── Likes ─────────────────────────────────────────────────────────────────

  addLike(dogId: number, text: string): Observable<Like> {
    return this.http.post<Like>(`${this.apiUrl}/dog/${dogId}/like`, { like: text }, this.options);
  }

  updateLike(dogId: number, likeId: number, text: string): Observable<Like> {
    return this.http.put<Like>(`${this.apiUrl}/dog/${dogId}/like/${likeId}`, { like: text }, this.options);
  }

  deleteLike(dogId: number, likeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dog/${dogId}/like/${likeId}`, this.options);
  }

  // ── Vaccines ──────────────────────────────────────────────────────────────

  getVaccines(dogId: number): Observable<Vaccine[]> {
    return this.http.get<Vaccine[]>(`${this.apiUrl}/dog/${dogId}/vaccines`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  renewVaccine(dogId: number, vaccineId: number): Observable<Vaccine> {
    return this.http.put<Vaccine>(`${this.apiUrl}/dog/${dogId}/vaccine/${vaccineId}/renew`, {}, this.options);
  }

  setVaccinationDate(dogId: number, vaccineId: number, vaccinatedDate: string): Observable<Vaccine> {
    return this.http.put<Vaccine>(`${this.apiUrl}/dog/${dogId}/vaccine/${vaccineId}/date`, { vaccinatedDate }, this.options);
  }

  addCustomVaccine(dogId: number, vaccine: { name: string; vaccinatedDate: string; expirationDate: string }): Observable<Vaccine> {
    return this.http.post<Vaccine>(`${this.apiUrl}/dog/${dogId}/vaccine`, vaccine, this.options);
  }

  deleteVaccine(dogId: number, vaccineId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dog/${dogId}/vaccine/${vaccineId}`, this.options);
  }
  


  // ── Events ────────────────────────────────────────────────────────────────

  // GET /owner/event/dog/{dogId}
  getEventsByDog(dogId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/event/dog/${dogId}`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/my-events
  getMyEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/my-events`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /owner/event/add
  createEvent(event: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/event/add`, event, this.options);
  }

  // DELETE /owner/event/{id}
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/event/${id}`, this.options);
  }

  // PUT /owner/event/{id}/edit
  editEvent(id: number, updates: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}/event/${id}/edit`, updates, this.options);
  }

  // POST /owner/event/{eventId}/dog/{dogId}
  addDogToEvent(eventId: number, dogId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/event/${eventId}/dog/${dogId}`, {}, this.options);
  }

  // DELETE /owner/event/{eventId}/dog/{dogId}
  removeDogFromEvent(eventId: number, dogId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/event/${eventId}/dog/${dogId}`, this.options);
  }

  // DELETE /owner/event/{eventId}/attend
  leaveEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/event/${eventId}/attend`, this.options);
  }

  // ── Friends ───────────────────────────────────────────────────────────────

  // GET /owner/friends
  getFriends(): Observable<OwnerPublicFriend[]> {
    return this.http.get<OwnerPublicFriend[]>(`${this.apiUrl}/friends`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/friends/search?q={query}
  searchFriends(query: string): Observable<OwnerPublicSearch[]> {
    return this.http.get<OwnerPublicSearch[]>(`${this.apiUrl}/friends/search`, {
      ...this.options,
      params: { q: query }
    }).pipe(catchError(() => of([])));
  }

  // DELETE /owner/friend/{handle}
  removeFriend(handle: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/friend/${handle}`, this.options);
  }

  // ── Friend Requests ───────────────────────────────────────────────────────

  // POST /owner/friend-request/{handle}
  sendFriendRequest(handle: string): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(`${this.apiUrl}/friend-request/${handle}`, {}, this.options);
  }

  // GET /owner/friend-requests/pending
  getPendingRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests/pending`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/friend-requests/sent
  getSentRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/friend-requests/sent`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /owner/friend-request/{requestId}/accept
  acceptFriendRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friend-request/${requestId}/accept`, {}, this.options);
  }

  // POST /owner/friend-request/{requestId}/reject
  rejectFriendRequest(requestId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/friend-request/${requestId}/reject`, {}, this.options);
  }

  // ── Registration Requests ─────────────────────────────────────────────────

  // POST /owner/registration-request?dogId=&orgId=
  sendRegistrationRequest(dogId: number, orgId: number): Observable<RegistrationRequest> {
    const params = new HttpParams()
      .set('dogId', dogId.toString())
      .set('orgId', orgId.toString());
    return this.http.post<RegistrationRequest>(`${this.apiUrl}/registration-request`, {}, { ...this.options, params });
  }

  // GET /owner/registration-requests/sent
  getSentRegistrationRequests(): Observable<RegistrationRequest[]> {
    return this.http.get<RegistrationRequest[]>(`${this.apiUrl}/registration-requests/sent`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // ── Event Invitations ─────────────────────────────────────────────────────

  // POST /owner/event/{eventId}/invite-by-handle/{handle}
  sendInvitation(eventId: number, handle: string): Observable<EventInvitation> {
    return this.http.post<EventInvitation>(`${this.apiUrl}/event/${eventId}/invite-by-handle/${handle}`, {}, this.options);
  }

  // GET /owner/invitations
  getInvitations(): Observable<EventInvitation[]> {
    return this.http.get<EventInvitation[]>(`${this.apiUrl}/invitations`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /owner/invitation/{id}/accept
  acceptInvitation(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invitation/${id}/accept`, {}, this.options);
  }

  // DELETE /owner/invitation/{id}  (decline)
  declineInvitation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/invitation/${id}`, this.options);
  }

  // ── Favorite Organizations ─────────────────────────────────────────────────

  // GET /owner/favorites
  getFavoriteOrgs(): Observable<OrgPublic[]> {
    return this.http.get<OrgPublic[]>(`${this.apiUrl}/favorites`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /owner/favorite/{orgId}
  addFavoriteOrg(orgId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/favorite/${orgId}`, {}, this.options);
  }

  // DELETE /owner/favorite/{orgId}
  removeFavoriteOrg(orgId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorite/${orgId}`, this.options);
  }

  // ── Organizations (owner-facing) ──────────────────────────────────────────

  // GET /owner/org/{orgId}
  getOrgById(orgId: number): Observable<OrgPublic | null> {
    return this.http.get<OrgPublic>(`${this.apiUrl}/org/${orgId}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /owner/search-orgs/name?name=
  searchOrgsByName(name: string): Observable<OrgPublic[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<OrgPublic[]>(`${this.apiUrl}/search-orgs/name`, { ...this.options, params }).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/search-orgs/service?service=
  searchOrgsByService(serviceName: string): Observable<OrgPublic[]> {
    const params = new HttpParams().set('service', serviceName);
    return this.http.get<OrgPublic[]>(`${this.apiUrl}/search-orgs/service`, { ...this.options, params }).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/org/{orgId}/services
  getOrgServices(orgId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/org/${orgId}/services`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /owner/org/{orgId}/mean-rating
  getOrgMeanRating(orgId: number): Observable<number | null> {
    return this.http.get<number>(`${this.apiUrl}/org/${orgId}/mean-rating`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /owner/nearby-orgs?lat=&lng=&miles=
  getNearbyOrganizations(lat: number, lng: number, miles: number): Observable<OrgPublic[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('miles', miles.toString());
    return this.http.get<OrgPublic[]>(`${this.apiUrl}/nearby-orgs`, { ...this.options, params });
  }

  // GET /owner/nearby-events?lat=&lng=&miles=
  getNearbyEvents(lat: number, lng: number, miles: number): Observable<CalendarEvent[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('miles', miles.toString());
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/nearby-events`, { ...this.options, params });
  }
}