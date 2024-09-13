import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-carousel',
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent {
  @Input() category!: { key: string, value: any[] };
  constructor(private router: Router) {}
  scrollLeft(categoryKey: string): void {
    const element = document.getElementById(categoryKey);
    if (element) {
      element.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  scrollRight(categoryKey: string): void {
    const element = document.getElementById(categoryKey);
    if (element) {
      element.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }

  showVideo(video: any): void {
    console.log('Video:', video);
    this.router.navigate(['/video', video.id]);
  }
}