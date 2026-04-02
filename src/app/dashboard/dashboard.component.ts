import { Component, OnInit } from '@angular/core';
import { DogService } from '../services/dog/dog.service';
import { Dog } from '../models/dog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(
    private dogService: DogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dogs = this.dogService.getDogs();
  }

  dogs: Dog[] = [];

  logout() {
    this.router.navigate(['/']);
  }
  

}
