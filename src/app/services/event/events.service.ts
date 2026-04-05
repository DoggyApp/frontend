import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiUrl = 'http://localhost:8080/event';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getEventsByDog(dogId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/dog/${dogId}`, this.options);
  }

  getEventsByLocation(locationId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/location/${locationId}`, this.options);
  }

  getEventsByUser(userId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/user/${userId}`, this.options);
  }

  createEvent(event: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/add`, event, this.options);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.options);
  }

  editEvent(id: number, updates: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}/${id}/edit`, updates, this.options);
  }

  joinEvent(id: number): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}/${id}/join`, {}, this.options);
  }

  addDogToEvent(eventId: number, dogId: number): Observable<CalendarEvent> {
    const params = new HttpParams().set('dogId', dogId.toString());
    return this.http.put<CalendarEvent>(`${this.apiUrl}/${eventId}/dog`, {}, { ...this.options, params });
  }

}
