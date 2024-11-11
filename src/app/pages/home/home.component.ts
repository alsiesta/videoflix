import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { newVideo, Video } from 'src/app/models/models';
import { Subscription, timer } from 'rxjs';


/**
 * HomeComponent is responsible for displaying the home page of the application.
 * It fetches videos from the backend, groups them by category, and handles video rotation.
 */
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

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Fetches videos, groups them by category, and initializes video rotation.
   */
  async ngOnInit () {
    await this.loadVideos();
    this.groupVideosByCategory();
    this.initializeVideoRotation();
  }

  /**
   * Lifecycle hook that is called after a component's view has been fully initialized.
   * Ensures the background video is muted when metadata is loaded.
   */
  ngAfterViewInit () {
    // Ensure the video is muted when metadata is loaded
    if (this.backgroundVideo && this.backgroundVideo.nativeElement) {
      this.backgroundVideo.nativeElement.addEventListener('loadedmetadata', () => {
        this.backgroundVideo.nativeElement.muted = true;
      });
    }
  }


    /**
   * Groups videos by their categories.
   */
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


   /**
   * Loads videos from the backend and processes their paths.
   */
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



  /**
   * Fetches videos from the backend.
   * @returns A promise that resolves to an array of videos.
   */
  private async getVideos (): Promise<Video[]> {
    const url = `${environment.baseUrl}/videos/`;
    try {
      const videos = await lastValueFrom(this.http.get<Video[]>(url));
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


  /**
   * Handles errors that occur during video loading.
   * @param error The error that occurred.
   */
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


    /**
   * Scrolls the video list to the left.
   * @param id The ID of the video list element.
   */
  scrollLeft (id: string) {
    this.scroll('left', id);
  }


    /**
   * Scrolls the video list to the right.
   * @param id The ID of the video list element.
   */
  scrollRight (id: string) {
    this.scroll('right', id);
  }


    /**
   * Scrolls the video list in the specified direction.
   * @param direction The direction to scroll ('left' or 'right').
   * @param id The ID of the video list element.
   */
  private scroll (direction: 'left' | 'right', id: string) {
    const container = document.getElementById(id);
    const scrollAmount = direction === 'left' ? -200 : 200;
    container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }


    /**
   * Returns the link to the current video.
   * @returns The video link.
   */
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


  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Cleans up the timer subscription.
   */
  ngOnDestroy (): void {
    // Clean up the timer subscription to prevent memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

}