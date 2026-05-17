import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SessionType = 'owner' | 'user' | 'org' | null;

const SESSION_KEY = 'sessionType';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionType$ = new BehaviorSubject<SessionType>(
    localStorage.getItem(SESSION_KEY) as SessionType ?? null
  );

  readonly sessionType = this.sessionType$.asObservable();

  get currentSession(): SessionType {
    return this.sessionType$.getValue();
  }

  setSession(type: SessionType): void {
    if (type) {
      localStorage.setItem(SESSION_KEY, type);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    this.sessionType$.next(type);
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.sessionType$.next(null);
  }
}
