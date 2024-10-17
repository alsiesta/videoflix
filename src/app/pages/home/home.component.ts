import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { newVideo, Video } from 'src/app/models/models';
import { Subscription, timer } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('backgroundVideo') backgroundVideo!: ElementRef<HTMLVideoElement>;

  private readonly BASE_URL = environment.baseUrl;

  videos: Video[] = [];
  currentVideo: Video | undefined;
  currentIndex: number = 0;
  private timerSubscription: Subscription | undefined;
  hero_video_path: string = `${this.BASE_URL}/media/videos/people_480p.m3u8`;
  video_path: string = `${this.BASE_URL}/media/videos/people.mp4`;
  hero_video: Video = newVideo();
  error: string | null = null;
  groupedVideos: { [key: string]: any[] } = {};

  get groupedVideosKeys (): string[] {
    return Object.keys(this.groupedVideos);
  }



  constructor (private http: HttpClient) { }

  async ngOnInit () {
    console.log('Base URL:', this.BASE_URL);
    await this.loadVideos();
    this.groupVideosByCategory();
    this.initializeVideoRotation();
  }

  ngAfterViewInit () {
    // Ensure the video is muted when metadata is loaded
    if (this.backgroundVideo && this.backgroundVideo.nativeElement) {
      this.backgroundVideo.nativeElement.addEventListener('loadedmetadata', () => {
        this.backgroundVideo.nativeElement.muted = true;
      });
    }
  }

  groupVideosByCategory (): void {
    this.videos.forEach(video => {
      video.categories.forEach(category => {
        if (!this.groupedVideos[category.name]) {
          this.groupedVideos[category.name] = [];
        }
        this.groupedVideos[category.name].push(video);
      });
    });
  }


  private async loadVideos () {
    try {
      const videos = await this.getVideos();
      this.videos = videos.map(video => {
        const splitPath = video.path.split('.');
        const basePath = splitPath[0]; // Get the base path without the extension
        return {
          ...video,
          path: `${this.BASE_URL}/${basePath}_480p.m3u8`, // Use the base path without the extension
          imagepath: `${this.BASE_URL}/${video.imagepath}`,
          video_file: `${this.BASE_URL}/${basePath}.mp4`, // Use only the first part of the split path
        };
      });
    } catch (error) {
      this.handleError(error);
    }
  }




  private async getVideos (): Promise<Video[]> {
    const url = `${environment.baseUrl}/videos/`;
    try {
      const videos = await lastValueFrom(this.http.get<Video[]>(url));
      console.log('Fetched videos:', videos);
      return videos;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('HTTP Error:', error.message);
      } else {
        console.error('Unknown Error:', error);
      }
      throw error; // Re-throw the error after logging it
    }
  }

  private handleError (error: any) {
    if (error instanceof HttpErrorResponse) {
      this.error = error.error.error || error.error.message || error.error.detail || 'Fehler beim Laden der Videos';
    } else if (error instanceof TypeError) {
      console.error('Netzwerkfehler oder JSON-Verarbeitungsfehler:', error);
      this.error = 'Netzwerkfehler oder Fehler bei der Verarbeitung der Antwort';
    } else {
      console.error('Unbekannter Fehler:', error);
      this.error = 'Fehler beim Laden der Videos';
    }
  }

  scrollLeft (id: string) {
    this.scroll('left', id);
  }

  scrollRight (id: string) {
    this.scroll('right', id);
  }

  private scroll (direction: 'left' | 'right', id: string) {
    const container = document.getElementById(id);
    const scrollAmount = direction === 'left' ? -200 : 200;
    container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }


  getVideoLink (): string {
    return `/video/${this.videos[0].id}`;
  }


  /**
   * Initializes the video rotation by selecting a random video and setting up a timer.
   */
  private initializeVideoRotation (): void {
    if (this.videos.length > 0) {
      // Select a random starting index
      this.currentIndex = Math.floor(Math.random() * this.videos.length);
      this.hero_video = this.videos[this.currentIndex];
      console.log(this.hero_video);

      // Set up a timer to change the video every 10 seconds
      this.timerSubscription = timer(10000, 10000).subscribe(() => {
        this.nextVideo();
      });
    }
  }

  /**
   * Advances to the next video in the list. Wraps around to the start if at the end.
   */
  private nextVideo (): void {
    if (this.videos.length === 0) {
      return;
    }
    // Increment the index and wrap around if necessary
    this.currentIndex = (this.currentIndex + 1) % this.videos.length;
    this.hero_video = this.videos[this.currentIndex];
  }


  ngOnDestroy (): void {
    // Clean up the timer subscription to prevent memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

}