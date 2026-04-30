import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Dog } from 'src/app/models/dog';
import { Note } from 'src/app/models/Note';
import { Alert } from 'src/app/models/alert';
import { Like } from 'src/app/models/like';
import { Vaccine } from 'src/app/models/vaccine';
import { CalendarEvent } from 'src/app/models/event';
import { Location } from 'src/app/models/location';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.userApiUrl;

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // ── Auth ──────────────────────────────────────────────────────────────────

  // POST /user/login
  login(email: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // GET /user/session
  getSession(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/session`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // POST /user/logout
  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, this.options);
  }

  // ── User methods ──────────────────────────────────────────────────────────

  // GET /user/all
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`, this.options);
  }

  // GET /user/{id}
  getUsersById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // PUT /user/password
  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/password`, { oldPassword, newPassword }, this.options);
  }

  // USERS SHOULD NOT BE ABLE TO REGISTER — they can only be created by organizations

  // ── Dog methods (read and care-related — users cannot create or delete dogs) ──

  // GET /user/dogs
  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/dogs`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /user/dog/{id}
  getDogById(id: number): Observable<Dog | null> {
    return this.http.get<Dog>(`${this.apiUrl}/dog/${id}`, this.options).pipe(
      catchError(() => of(null))
    );
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

  // ── Event methods ─────────────────────────────────────────────────────────

  // GET /user/my-events
  getMyEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/my-events`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // GET /user/event/dog/{dogId}
  getEventsByDog(dogId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/event/dog/${dogId}`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // POST /user/event/add
  createEvent(event: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/event/add`, event, this.options);
  }

  // DELETE /user/event/{id}
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/event/${id}`, this.options);
  }

  // PUT /user/event/{id}/edit
  editEvent(id: number, updates: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}/event/${id}/edit`, updates, this.options);
  }

  // POST /user/event/{id}/attend
  joinEvent(_eventId: number): Observable<string> {
    return of('building');
  }

  // POST /user/event/{eventId}/dog/{dogId}
  addDogToEvent(eventId: number, dogId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/event/${eventId}/dog/${dogId}`, {}, this.options);
  }

  // DELETE /user/event/{eventId}/dog/{dogId}
  removeDogFromEvent(eventId: number, dogId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/event/${eventId}/dog/${dogId}`, this.options);
  }

  // ── Location methods ──────────────────────────────────────────────────────

  // GET /user/locations
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`, this.options).pipe(
      catchError(() => of([]))
    );
  }

  // -- AWS EKS reference (for future deployment) --
  // public apiUrl: String = (window as any)._env_.LOAD_BALANCER_URL;

}
