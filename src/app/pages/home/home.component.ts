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
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  videos: Video[] = []; 
  constructor(private http: HttpClient) {}


  ngOnInit() {
    this.fetchVideos();
  }

  fetchVideos() {
    this.http.get<Video[]>('http://127.0.0.1:8000/videos/')
      .subscribe(data => {
        this.videos = data;
        console.log(this.videos); // Log the response to the console
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
