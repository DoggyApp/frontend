import { Component, Input, OnInit } from '@angular/core';
import { Dog } from '../models/dog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dog-card',
  templateUrl: './dog-card.component.html',
  styleUrls: ['./dog-card.component.css']
})
export class DogCardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  @Input() dog!: Dog;

  viewProfile() {
    this.router.navigate(['/profile', this.dog.id]);
  }
}
