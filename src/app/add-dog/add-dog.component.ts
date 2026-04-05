import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DogService } from '../services/dog/dog.service';

@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.component.html',
  styleUrls: ['./add-dog.component.css'],
  standalone: false
})
export class AddDogComponent implements OnInit {

  constructor(
    private dogService: DogService,
    private location: Location
  ) { }

  ngOnInit(): void { }

  newDog = { name: '', breed: '', age: 0, weight: 0, image: '' };
  bordetellaDate = this.todayStr();
  rabiesDate = this.todayStr();
  submitError = '';

  todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit() {
    this.dogService.addDog(this.newDog, this.bordetellaDate, this.rabiesDate).subscribe({
      next: () => this.location.back(),
      error: () => { this.submitError = 'Failed to add dog. Please check all fields and try again.'; }
    });
  }

  goBack() {
    this.location.back();
  }

}
