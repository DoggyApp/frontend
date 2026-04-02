import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  loginError = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.userService.login(this.email, this.password).subscribe(user => {
      if (user) {
        this.loginError = false;
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = true;
      }
    });
  }

}
