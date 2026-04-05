import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from 'src/app/models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'http://localhost:8080/location';

  // withCredentials required — all location endpoints require org session
  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/all`, this.options);
  }

  addLocation(name: string, address: string): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/add`, { name, address, offsite: false }, this.options);
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.options);
  }

}
