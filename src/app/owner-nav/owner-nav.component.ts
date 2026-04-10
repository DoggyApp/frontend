import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from '../models/owner';
import { OwnerService } from '../services/owner/owner.service';

@Component({
  selector: 'app-owner-nav',
  templateUrl: './owner-nav.component.html',
  styleUrls: ['./owner-nav.component.css'],
  standalone: false
})
export class OwnerNavComponent implements OnInit {

  owner: Owner | null = null;

  constructor(
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerService.getSession().subscribe(owner => {
      this.owner = owner;
    });
  }

  logout(): void {
    this.ownerService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
