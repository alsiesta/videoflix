import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { UserResetPasswordComponent } from './pages/user-reset-password/user-reset-password.component';
import { UserconfirmnewpasswordComponent } from './pages/user-confirm-new-password/user-confirm-new-password.component';
import { VideodetailComponent } from './pages/videodetail/videodetail.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login/:uidb64/:token', component: LoginComponent },
  { path: 'user_reset_password', component: UserResetPasswordComponent, canActivate: [AuthGuard]  },
  { path: 'reset/:uidb64/:token', component: UserconfirmnewpasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'video/:id', component: VideodetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
