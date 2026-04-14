import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component'
import { UserLoginComponent } from './user-components/user-login/user-login.component';
import { UserDashboardComponent } from './user-components/user-dashboard/user-dashboard.component';
import { DogProfileComponent } from './dog-components/dog-profile/dog-profile.component';
import { DogCalendarComponent } from './dog-components/dog-calendar/dog-calendar.component';
import { OrgLoginComponent } from './organization-components/org-login/org-login.component';
import { OrgDashboardComponent } from './organization-components/org-dashboard/org-dashboard.component';
import { UserProfileComponent } from './user-components/user-profile/user-profile.component';
import { AddDogComponent } from './dog-components/add-dog/add-dog.component';
import { OrgCalendarComponent } from './organization-components/org-calendar/org-calendar.component';
import { UserCalendarComponent } from './user-components/user-calendar/user-calendar.component';
import { OrgProfileComponent } from './organization-components/org-profile/org-profile.component';
import { OwnerLoginComponent } from './owner-components/owner-login/owner-login.component';
import { OwnerDashboardComponent } from './owner-components/owner-dashboard/owner-dashboard.component';
import { OwnerRegisterComponent } from './owner-components/owner-register/owner-register.component';
import { OwnerCalendarComponent } from './owner-components/owner-calendar/owner-calendar.component';
import { OwnerEditProfileComponent } from './owner-components/owner-edit-profile/owner-edit-profile.component';
import { OwnerFriendsComponent } from './owner-components/owner-friends/owner-friends.component';
import { OwnerSearchOrgsComponent } from './owner-components/owner-search-orgs/owner-search-orgs.component';
import { PublicOrgProfileComponent } from './owner-components/public-org-profile/public-org-profile.component';
import { OwnerPublicProfileComponent } from './owner-components/owner-public-profile/owner-public-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'org-login', component: OrgLoginComponent },
  { path: 'org-dashboard', component: OrgDashboardComponent },
  { path: 'org-calendar', component: OrgCalendarComponent },
  { path: 'org-profile', component: OrgProfileComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'user-calendar', component: UserCalendarComponent },
  { path: 'add-dog', component: AddDogComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'dog-profile/:id', component: DogProfileComponent },
  { path: 'dog-calendar/:id', component: DogCalendarComponent },
  // Owner routes
  { path: 'owner-login', component: OwnerLoginComponent },
  { path: 'owner-register', component: OwnerRegisterComponent },
  { path: 'owner-dashboard', component: OwnerDashboardComponent },
  { path: 'owner-calendar', component: OwnerCalendarComponent },
  { path: 'owner-edit-profile', component: OwnerEditProfileComponent },
  { path: 'owner-friends', component: OwnerFriendsComponent },
  { path: 'owner-search-orgs', component: OwnerSearchOrgsComponent },
  { path: 'public-org-profile/:id', component: PublicOrgProfileComponent },
  { path: 'owner-public-profile/:handle', component: OwnerPublicProfileComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
