import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AllowedPathsGuard implements CanActivate {

  // Define allowed routes here (without leading slash)
  private allowedPaths = ['', 'about', 'context', 'home'];

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const path = route.url.map(segment => segment.path).join('/');

    if (this.allowedPaths.includes(path)) {
      return true; // allow navigation
    } else {
      // Redirect or show 404 page
      this.router.navigate(['/not-found']);
      return false;
    }
  }
}

