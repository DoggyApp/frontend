import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  registerError = ""

  public user: User = {
    id: 0,
    name: '',
    email: '',
    password: ''
  };

  confirmPassword = '';

  onSubmit() {

    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Register user:', this.user);

    const registeredUser = this.userService.register(this.user);

    if (registeredUser) {
      // ✅ Success: route to login
      this.registerError = '';
      this.router.navigate(['/login']);
    } else {
      // ❌ Failure: email already exists
      this.registerError = 'Email already registered. Try logging in.';
    }

  }

}
