import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user-components/user-login/user-login.component';
import { UserDashboardComponent } from './user-components/user-dashboard/user-dashboard.component';
import { DogCardComponent } from './dog-components/dog-card/dog-card.component';
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
import { OwnerNavComponent } from './owner-components/owner-nav/owner-nav.component';
import { OwnerCalendarComponent } from './owner-components/owner-calendar/owner-calendar.component';
import { OwnerEditProfileComponent } from './owner-components/owner-edit-profile/owner-edit-profile.component';
import { OwnerFriendsComponent } from './owner-components/owner-friends/owner-friends.component';
import { OwnerSearchOrgsComponent } from './owner-components/owner-search-orgs/owner-search-orgs.component';
import { PublicOrgProfileComponent } from './owner-components/public-org-profile/public-org-profile.component';
import { OwnerPublicProfileComponent } from './owner-components/owner-public-profile/owner-public-profile.component';
import { OrgRegisterComponent } from './organization-components/org-register/org-register.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    UserLoginComponent,
    UserDashboardComponent,
    DogCardComponent,
    DogProfileComponent,
    DogCalendarComponent,
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
    PublicOrgProfileComponent,
    OwnerPublicProfileComponent,
    OrgRegisterComponent
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
