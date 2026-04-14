import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Owner } from '../../models/owner';
import { OwnerPublicFriend } from '../../models/owner-public';
import { OwnerService } from '../../services/owner/owner.service';

@Component({
  selector: 'app-owner-public-profile',
  templateUrl: './owner-public-profile.component.html',
  styleUrls: ['./owner-public-profile.component.css'],
  standalone: false
})
export class OwnerPublicProfileComponent implements OnInit {

  currentOwner: Owner | null = null;
  friend: OwnerPublicFriend | null = null;
  loading = true;
  accessDenied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: OwnerService
  ) {}

  ngOnInit(): void {
    const handle = this.route.snapshot.paramMap.get('handle');
    if (!handle) {
      this.router.navigate(['/owner-dashboard']);
      return;
    }

    this.ownerService.getSession().subscribe(owner => {
      if (!owner) {
        this.router.navigate(['/owner-login']);
        return;
      }
      this.currentOwner = owner;

      this.ownerService.getFriends().subscribe(friends => {
        const match = friends.find(f => f.handle === handle);
        if (!match) {
          this.accessDenied = true;
        } else {
          this.friend = match;
        }
        this.loading = false;
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/owner-friends']);
  }
}
