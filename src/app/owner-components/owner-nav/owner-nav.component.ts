import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../../models/owner';
import { OwnerService } from '../../services/owner/owner.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-owner-nav',
  templateUrl: './owner-nav.component.html',
  styleUrls: ['./owner-nav.component.css'],
  standalone: false
})
export class OwnerNavComponent implements OnInit {

  owner: Owner | null = null;
  pendingRequestCount = 0;

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      this.owner = owner;
    });
    this.ownerService.getPendingRequests().subscribe(requests => {
      this.pendingRequestCount = requests.length;
    });
  }

  logout(): void {
    this.ownerService.logout().subscribe({
      next: () => { this.authService.clearSession(); this.router.navigate(['/']); },
      error: () => { this.authService.clearSession(); this.router.navigate(['/']); }
    });
  }
}
