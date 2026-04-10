import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Owner } from './models/owner';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/owner';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) { }

  // GET /owner/all — returns all owners associated with the logged-in org
  getClients(): Observable<Owner[]> {
    return this.http.get<Owner[]>(`${this.apiUrl}/all`, this.options);
  }
}
