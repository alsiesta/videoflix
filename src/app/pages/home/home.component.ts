import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  baseUrl = 'http://127.0.0.1:8000';
  videos: Video[] = []; 
  constructor(private http: HttpClient) {}


  ngOnInit() {
    this.fetchVideos();
  }

  fetchVideos() {
    this.http.get<Video[]>(this.baseUrl + '/videos/')
      .subscribe(data => {
        this.videos = data.map(video => ({
          ...video,
          path: `${this.baseUrl}/${video.path}`
        }));
        console.log(this.videos); 
      });
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
