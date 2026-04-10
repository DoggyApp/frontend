import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DogCardComponent } from './dog-card/dog-card.component';
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
import { OwnerNavComponent } from './owner-nav/owner-nav.component';
import { OwnerCalendarComponent } from './owner-calendar/owner-calendar.component';
import { OwnerEditProfileComponent } from './owner-edit-profile/owner-edit-profile.component';
import { OwnerFriendsComponent } from './owner-friends/owner-friends.component';
import { OwnerSearchOrgsComponent } from './owner-search-orgs/owner-search-orgs.component';
import { PublicOrgProfileComponent } from './public-org-profile/public-org-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    DogCardComponent,
    ProfileComponent,
    CalendarComponent,
    OrgLoginComponent,
    OrgDashboardComponent,
    UserProfileComponent,
    AddDogComponent,
    OrgCalendarComponent,
    UserCalendarComponent,
    OrgProfileComponent,
    OwnerLoginComponent,
    OwnerDashboardComponent,
    OwnerRegisterComponent,
    OwnerNavComponent,
    OwnerCalendarComponent,
    OwnerEditProfileComponent,
    OwnerFriendsComponent,
    OwnerSearchOrgsComponent,
    PublicOrgProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
