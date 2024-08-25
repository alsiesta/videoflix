import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggingIn = false;
  isRegistering = false;
  isSignedIn = false;
  title = 'videoflix';
  username: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.authService.username$.subscribe(username => {
        this.username = username;
      })
    );

    this.subscriptions.add(
      this.authService.isLoggingIn$.subscribe(value => this.isLoggingIn = value)
    );

    this.subscriptions.add(
      this.authService.isRegistering$.subscribe(value => this.isRegistering = value)
    );

    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isLoggingIn = event.url === '/login';
          this.isRegistering = event.url === '/register';
          this.isSignedIn = event.url === '/home';
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
    this.authService.setUsername(null);
    this.router.navigate(['/login']);
  }
}