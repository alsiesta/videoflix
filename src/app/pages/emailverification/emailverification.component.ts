import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.baseUrl; 

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.scss']
})
export class EmailverificationComponent implements OnInit  {

  message: string = 'Verifying...';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    if (uid && token) {
      this.verifyEmail(uid, token);
    } else {
      console.error('UID or token is null');
      // Handle the null case appropriately, e.g., show an error message to the user
      this.message = 'Verification failed: UID or token is missing.';
    }
  }

  verifyEmail(uid: string, token: string): void {
    this.http.get(`${BASE_URL}/user/verify-email/${uid}/${token}/`).subscribe(
      (response: any) => {
        this.message = response.detail;
      },
      (error) => {
        this.message = 'Verification failed. Invalid token or user ID.';
      }
    );
  }

}
