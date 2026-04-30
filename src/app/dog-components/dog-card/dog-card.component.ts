import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Dog } from '../../models/dog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dog-card',
    templateUrl: './dog-card.component.html',
    styleUrls: ['./dog-card.component.css'],
    standalone: false
})
export class DogCardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  @Input() dog!: Dog;
  @Input() showRemove = false;
  @Output() removed = new EventEmitter<void>();

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent infinite loop
    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23adb5bd' font-size='13' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E`;
  }

  viewProfile() {
    this.router.navigate(['/dog-profile', this.dog.id]);
  }
}
