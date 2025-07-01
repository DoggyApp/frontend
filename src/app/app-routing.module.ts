import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AllowedPathsGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AllowedPathsGuard] },
  { path: 'context', component: ContextComponent, canActivate: [AllowedPathsGuard] },
  { path: 'not-found', component: NotFoundComponent },
  // catch-all route to redirect to not-found
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
