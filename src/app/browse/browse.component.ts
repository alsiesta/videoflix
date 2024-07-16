import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent {
  auth = inject(AuthService);
  name = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}').name;
  userProfileImg = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}').picture;
  email = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}').email;
  picture = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}').picture;
  
  signOut () {
    // this.auth.signOut();
  }

}
