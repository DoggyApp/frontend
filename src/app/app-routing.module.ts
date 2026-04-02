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
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'org-login', component: OrgLoginComponent },
  { path: 'org-dashboard', component: OrgDashboardComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'add-dog', component: AddDogComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'calendar/:id', component: CalendarComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
