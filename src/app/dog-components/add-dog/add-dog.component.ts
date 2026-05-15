import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { OwnerService } from '../../services/owner/owner.service';
import { STANDARD_VACCINES } from '../../models/standard-vaccines';

@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.component.html',
  styleUrls: ['./add-dog.component.css'],
  standalone: false
})
export class AddDogComponent implements OnInit {

  constructor(
    private ownerService: OwnerService,
    private location: Location
  ) { }

  ngOnInit(): void { }

  newDog = { name: '', breed: '', birthday: '', weight: 0, image: '' };
  submitError = '';

  standardVaccines = STANDARD_VACCINES;

  vaccinatedDates: Record<string, string> = Object.fromEntries(
    STANDARD_VACCINES.map(v => [v.name, this.todayStr()])
  );

  todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit() {
    const vaccines = this.standardVaccines
      .filter(v => this.vaccinatedDates[v.name])
      .map(v => ({ name: v.name, vaccinatedDate: this.vaccinatedDates[v.name] }));

    this.ownerService.addDog(this.newDog, vaccines).subscribe({
      next: () => this.location.back(),
      error: () => { this.submitError = 'Failed to add dog. Please check all fields and try again.'; }
    });
  }

  goBack() {
    this.location.back();
  }

}
