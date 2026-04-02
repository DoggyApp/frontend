import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dog } from 'src/app/models/dog';
import { Note } from 'src/app/models/Note';
import { Alert } from 'src/app/models/alert';
import { Like } from 'src/app/models/like';
import { Vaccine } from 'src/app/models/vaccine';

@Injectable({
  providedIn: 'root'
})
export class DogService {

  private apiUrl = 'http://localhost:8080/dog';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.apiUrl}/all`, this.options);
  }

  getDogById(id: number): Observable<Dog | null> {
    return this.http.get<Dog>(`${this.apiUrl}/${id}`, this.options).pipe(
      catchError(() => of(null))
    );
  }

  // Notes
  addNote(dogId: number, text: string): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/${dogId}/note`, { note: text }, this.options);
  }

  updateNote(dogId: number, noteId: number, text: string): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${dogId}/note/${noteId}`, { note: text }, this.options);
  }

  deleteNote(dogId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dogId}/note/${noteId}`, this.options);
  }

  // Alerts
  addAlert(dogId: number, text: string): Observable<Alert> {
    return this.http.post<Alert>(`${this.apiUrl}/${dogId}/alert`, { alert: text }, this.options);
  }

  updateAlert(dogId: number, alertId: number, text: string): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/${dogId}/alert/${alertId}`, { alert: text }, this.options);
  }

  deleteAlert(dogId: number, alertId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dogId}/alert/${alertId}`, this.options);
  }

  // Likes
  addLike(dogId: number, text: string): Observable<Like> {
    return this.http.post<Like>(`${this.apiUrl}/${dogId}/like`, { like: text }, this.options);
  }

  updateLike(dogId: number, likeId: number, text: string): Observable<Like> {
    return this.http.put<Like>(`${this.apiUrl}/${dogId}/like/${likeId}`, { like: text }, this.options);
  }

  deleteLike(dogId: number, likeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dogId}/like/${likeId}`, this.options);
  }

  // Vaccines
  getVaccines(dogId: number): Observable<Vaccine[]> {
    return this.http.get<Vaccine[]>(`${this.apiUrl}/${dogId}/vaccines`, this.options);
  }

  // Sets vaccinatedDate to today and auto-calculates expiration on the backend
  renewVaccine(dogId: number, vaccineId: number): Observable<Vaccine> {
    return this.http.put<Vaccine>(`${this.apiUrl}/${dogId}/vaccine/${vaccineId}/renew`, {}, this.options);
  }

  // Sets a specific vaccinatedDate — used when logging a past date
  // Assumed endpoint: PUT /dog/{dogId}/vaccine/{vaccineId}/date
  setVaccinationDate(dogId: number, vaccineId: number, vaccinatedDate: string): Observable<Vaccine> {
    return this.http.put<Vaccine>(`${this.apiUrl}/${dogId}/vaccine/${vaccineId}/date`, { vaccinatedDate }, this.options);
  }

  addCustomVaccine(dogId: number, vaccine: { name: string; vaccinatedDate: string; expirationDate: string }): Observable<Vaccine> {
    return this.http.post<Vaccine>(`${this.apiUrl}/${dogId}/vaccine`, vaccine, this.options);
  }

  // Assumed endpoint: DELETE /dog/{dogId}/vaccine/{vaccineId}
  deleteVaccine(dogId: number, vaccineId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dogId}/vaccine/${vaccineId}`, this.options);
  }

  addDog(dog: { name: string; breed: string; age: number; weight: number; image: string }, bordetellaDate: string, rabiesDate: string): Observable<Dog> {
    const params = new HttpParams()
      .set('bordetellaDate', bordetellaDate)
      .set('rabiesDate', rabiesDate);
    return this.http.post<Dog>(`${this.apiUrl}/add`, dog, { ...this.options, params });
  }

  deleteDog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.options);
  }

}
