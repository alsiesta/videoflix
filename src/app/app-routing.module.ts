import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { UserResetPasswordComponent } from './pages/user-reset-password/user-reset-password.component';

const routes: Routes = [
  // { path: '', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login/:uidb64/:token', component: LoginComponent },
  { path: 'user_reset_password', component: UserResetPasswordComponent },

  { path: 'reset/:uidb64/:token', component: UserResetPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: 'browse', component: BrowseComponent },
  // { path: 'activate/:uid/:token', component:ActivationComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
