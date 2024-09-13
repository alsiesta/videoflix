import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { Video } from 'src/app/models/models';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly BASE_URL = 'http://127.0.0.1:8000';
  videos: Video[] = [];
  error: string | null = null;
  groupedVideos: { [key: string]: any[] } = {};
  get groupedVideosKeys(): string[] {
    return Object.keys(this.groupedVideos);
  }

  constructor (private http: HttpClient) { }

  async ngOnInit () {
    await this.loadVideos();
    this.groupVideosByCategory();
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
    // console.log('Grouped Videos:', this.groupedVideos); // Log the grouped videos
  }


  private async loadVideos () {
    try {
      const videos = await this.getVideos();
      this.videos = videos.map(video => ({
        ...video,
        path: `${this.BASE_URL}/${video.path}`,
        imagepath: `${this.BASE_URL}/${video.imagepath}`
      }));
      // console.log(this.videos);
    } catch (error) {
      this.handleError(error);
    }
  }

  private getVideos (): Promise<Video[]> {
    const url = `${environment.baseUrl}/videos/`;
    return lastValueFrom(this.http.get<Video[]>(url));
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

  
}