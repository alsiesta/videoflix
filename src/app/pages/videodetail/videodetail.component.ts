import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Video } from 'src/app/models/models';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videodetail',
  templateUrl: './videodetail.component.html',
  styleUrls: ['./videodetail.component.scss']
})
export class VideodetailComponent implements OnInit {
  video: Video | undefined;
  videoId: string | null = null;
  

  constructor (private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
  
  // getSanitizedUrl(videoPath: string | undefined): SafeUrl | null {
  //   return videoPath ? this.sanitizer.bypassSecurityTrustResourceUrl(videoPath) : null;
  // }
  
  async ngOnInit(): Promise<void> {
    this.videoId = this.route.snapshot.paramMap.get('id');
    if (this.videoId) {
     await this.getVideoDetails(this.videoId);
    }
  }

 async getVideoDetails(id: string): Promise<void> {
    this.http.get<Video>(`${environment.baseUrl}/videos/${id}`).subscribe(
      (data) => {
        const splitPath = data.path.split('.');
        const extension = splitPath.pop(); // Get the extension
        const basePath = splitPath.join('.'); // Get the base path without the extension
        
        this.video = {
          ...data,
          video_file: `${environment.baseUrl}${data.video_file}`,
          image_file: `${environment.baseUrl}${data.image_file}`,
          imagepath: `${environment.baseUrl}/${data.imagepath}`,
          path: `${environment.baseUrl}/${basePath}_480p.m3u8`, // Use the base path without the extension
          
        };
        console.log('Video details:', this.video);
      },
      (error) => {
        console.error('Error fetching video details:', error);
      }
    );
  }


  navigateToHome (event: Event) {
    event.preventDefault(); 
    this.router.navigate(['/home']);
  }

}