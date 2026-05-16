import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SessionType = 'owner' | 'user' | 'org' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionType$ = new BehaviorSubject<SessionType>(null);

  readonly sessionType = this.sessionType$.asObservable();

  get currentSession(): SessionType {
    return this.sessionType$.getValue();
  }

  setSession(type: SessionType): void {
    this.sessionType$.next(type);
  }

  clearSession(): void {
    this.sessionType$.next(null);
  }
}
