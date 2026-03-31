import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private users: User[] = [
    {
      id: 1,
      name: 'Sara',
      email: 'sara@email.com',
      password: '12345'
    },
    {
      id: 2,
      name: 'Lisa',
      email: 'lisa@email.com',
      password: '12345'
    }
  ]

  getUsers(): User[] {
    return this.users;
  }
    
  getUsersById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  authenticate(email: string, password: string): User | null {

    const user = this.users.find(
      u => u.email === email && u.password === password
    );

    return user ?? null;
  }

  register(newUser: Omit<User, 'id'>): User | null {
    // Check if email is already taken
    const exists = this.users.some(u => u.email === newUser.email);
    if (exists) {
      return null; // registration failed
    }

    const id = this.users.length + 1; // simple auto-increment
    const user: User = { id, ...newUser };
    this.users.push(user);
    return user; // registration succeeded
  }


  // public apiUrl: String = (window as any)._env_.LOAD_BALANCER_URL; 
  // constructor(private http:HttpClient) { }

  // getTestValue(): Observable<String> {
  //   console.log("inside get test value..."); 
  //   console.log(this.apiUrl); 
  //   return this.http.get(
  //     `${this.apiUrl}/registry/test`,
  //     { responseType: 'text' });
  // }

  // getBackendErrorTestValue(): Observable<String> {
  //   console.log("inside get backend error test value...");
  //   console.log(this.apiUrl); 
  //   return this.http.get(
  //     `${this.apiUrl}/registry/error-test`,
  //     { responseType: 'text' });
  // }
}
