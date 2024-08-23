import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggingIn = false;
  isRegistering = false;
  isSignedIn = false;
  title = 'videoflix';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit () {
    this.authService.isLoggingIn$.subscribe(value => this.isLoggingIn = value);
    this.authService.isRegistering$.subscribe(value => this.isRegistering = value);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoggingIn = event.url === '/login';
        this.isRegistering = event.url === '/register';
        this.isSignedIn = event.url === '/home';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    this.authService.setRegistering(false);
    this.authService.setLoggingIn(true);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
    this.authService.setRegistering(true);
    this.authService.setLoggingIn(false);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
}
