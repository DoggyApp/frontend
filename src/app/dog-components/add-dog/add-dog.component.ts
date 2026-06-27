import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner/owner.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { STANDARD_VACCINES } from '../../models/standard-vaccines';

//
@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.component.html',
  styleUrls: ['./add-dog.component.css'],
  standalone: false
})
export class AddDogComponent implements OnInit {

  constructor(
    private ownerService: OwnerService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  private get svc(): OwnerService | UserService | null {
    const s = this.authService.currentSession;
    if (s === 'owner') return this.ownerService;
    if (s === 'user')  return this.userService;
    return null;
  }

  get dashboardRoute(): string {
    const s = this.authService.currentSession;
    if (s === 'owner') return '/owner-dashboard';
    if (s === 'user')  return '/user-dashboard';
    return '/home';
  }

  ngOnInit(): void {
    if (!this.svc) { this.router.navigate(['/']); return; }
  }

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
    if (!this.svc) return;
    const vaccines = this.standardVaccines
      .filter(v => this.vaccinatedDates[v.name])
      .map(v => ({ name: v.name, vaccinatedDate: this.vaccinatedDates[v.name] }));

    this.svc.addDog(this.newDog, vaccines).subscribe({
      next: () => this.router.navigate([this.dashboardRoute]),
      error: () => { this.submitError = 'Failed to add dog. Please check all fields and try again.'; }
    });
  }

  goBack() {
    this.router.navigate([this.dashboardRoute]);
  }

}
