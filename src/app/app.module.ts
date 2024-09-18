import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivationComponent } from './pages/activation/activation.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { UserResetPasswordComponent } from './pages/user-reset-password/user-reset-password.component';
import { UserconfirmnewpasswordComponent } from './pages/user-confirm-new-password/user-confirm-new-password.component';
import { CategoryCarouselComponent } from './pages/category-carousel/category-carousel.component';
import { VideodetailComponent } from './pages/videodetail/videodetail.component';
import { VideoPlayerComponent } from './utils/video-player/video-player.component';
import { FooterComponent } from './pages/footer/footer.component';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz.component';
import { ImpressumComponent } from './pages/impressum/impressum.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BrowseComponent,
    RegisterComponent,
    ActivationComponent,
    HomeComponent,
    UserResetPasswordComponent,
    UserconfirmnewpasswordComponent,
    CategoryCarouselComponent,
    VideodetailComponent,
    VideoPlayerComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
