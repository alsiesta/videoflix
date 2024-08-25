import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

interface Category {
  id: number;
  name: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  created_at: string;
  categories: Category[];
  path: string;
  imagepath: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  baseUrl = 'http://127.0.0.1:8000';
  videos: Video[] = []; 
  error: string | null = null;
  constructor(private http: HttpClient) {}


  async ngOnInit() {
    // this.fetchVideos();
    try {
      this.videos = await this.getVideos();
      console.log(this.videos);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // HTTP-Fehlerbehandlung
        this.error = error.error.error || error.error.message || error.error.detail || 'Fehler beim Laden der Videos';
      } else if (error instanceof TypeError) {
        // Netzwerkfehler oder JSON-Verarbeitungsfehler
        console.error('Netzwerkfehler oder JSON-Verarbeitungsfehler:', error);
        this.error = 'Netzwerkfehler oder Fehler bei der Verarbeitung der Antwort';
      } else {
        // Generische Fehlerbehandlung
        console.error('Unbekannter Fehler:', error);
        this.error = 'Fehler beim Laden der Videos';
      }
    }
  }

  getVideos () {
    const url = environment.baseUrl + '/videos/';
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Token' + localStorage.getItem('token'));
    return lastValueFrom(this.http.get<Video[]>(url, { headers: headers }))
  }



  scrollLeft () {
    const container = document.getElementById('videos');
    container!.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight () {
    const container = document.getElementById('videos');
    container!.scrollBy({ left: 200, behavior: 'smooth' });
  }
}
