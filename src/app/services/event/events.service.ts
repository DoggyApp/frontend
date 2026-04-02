import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiUrl = 'http://localhost:8080/event';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // Assumed: GET /event/dog/{dogId}
  getEventsByDog(dogId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/dog/${dogId}`, this.options);
  }

  // Assumed: GET /event/location/{locationId}
  getEventsByLocation(locationId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/location/${locationId}`, this.options);
  }

  // POST /event/add?dogId=1 — user session only
  createEvent(event: Partial<Event>, dogId: number): Observable<Event> {
    const params = new HttpParams().set('dogId', dogId.toString());
    return this.http.post<Event>(`${this.apiUrl}/add`, event, { ...this.options, params });
  }

  // DELETE /event/{id} — user session, creator only
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.options);
  }

  // PUT /event/{id}/edit — user session, creator only
  editEvent(id: number, updates: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}/edit`, updates, this.options);
  }

  // PUT /event/{id}/join — user session only
  joinEvent(id: number): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}/join`, {}, this.options);
  }

  // PUT /event/{id}/dog?dogId=1 — user session only
  addDogToEvent(eventId: number, dogId: number): Observable<Event> {
    const params = new HttpParams().set('dogId', dogId.toString());
    return this.http.put<Event>(`${this.apiUrl}/${eventId}/dog`, {}, { ...this.options, params });
  }

}
