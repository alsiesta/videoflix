import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { RegisterComponent } from './pages/register/register.component';
import {ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivationComponent } from './pages/activation/activation.component'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BrowseComponent,
    RegisterComponent,
    ActivationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
