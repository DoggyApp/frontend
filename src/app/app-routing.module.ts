import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CalendarComponent } from './calendar/calendar.component';
import { OrgLoginComponent } from './org-login/org-login.component';
import { OrgDashboardComponent } from './org-dashboard/org-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AddDogComponent } from './add-dog/add-dog.component';
import { OrgCalendarComponent } from './org-calendar/org-calendar.component';
import { UserCalendarComponent } from './user-calendar/user-calendar.component';
import { OrgProfileComponent } from './org-profile/org-profile.component';
import { OwnerLoginComponent } from './owner-login/owner-login.component';
import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { OwnerRegisterComponent } from './owner-register/owner-register.component';
import { OwnerCalendarComponent } from './owner-calendar/owner-calendar.component';
import { OwnerEditProfileComponent } from './owner-edit-profile/owner-edit-profile.component';
import { OwnerFriendsComponent } from './owner-friends/owner-friends.component';
import { OwnerSearchOrgsComponent } from './owner-search-orgs/owner-search-orgs.component';
import { PublicOrgProfileComponent } from './public-org-profile/public-org-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'org-login', component: OrgLoginComponent },
  { path: 'org-dashboard', component: OrgDashboardComponent },
  { path: 'org-calendar', component: OrgCalendarComponent },
  { path: 'org-profile', component: OrgProfileComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'user-calendar', component: UserCalendarComponent },
  { path: 'add-dog', component: AddDogComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'calendar/:id', component: CalendarComponent },
  // Owner routes
  { path: 'owner-login', component: OwnerLoginComponent },
  { path: 'owner-register', component: OwnerRegisterComponent },
  { path: 'owner-dashboard', component: OwnerDashboardComponent },
  { path: 'owner-calendar', component: OwnerCalendarComponent },
  { path: 'owner-edit-profile', component: OwnerEditProfileComponent },
  { path: 'owner-friends', component: OwnerFriendsComponent },
  { path: 'owner-search-orgs', component: OwnerSearchOrgsComponent },
  { path: 'public-org-profile/:id', component: PublicOrgProfileComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
