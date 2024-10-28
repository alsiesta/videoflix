import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-carousel',
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent {
  
  
  /**
   * Input property to receive the category data.
   * The category object contains a key and an array of video items.
   */
  @Input() category!: { key: string, value: any[] };


   /**
   * Constructor to inject the Router service.
   * 
   * @param router - Router instance to navigate between routes.
   */
  constructor (private router: Router) { }
  

    /**
   * Scrolls the carousel to the left by 200 pixels.
   * 
   * @param categoryKey - The key of the category to identify the carousel element.
   */
  scrollLeft(categoryKey: string): void {
    const element = document.getElementById(categoryKey);
    if (element) {
      element.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }


    /**
   * Scrolls the carousel to the right by 200 pixels.
   * 
   * @param categoryKey - The key of the category to identify the carousel element.
   */
  scrollRight(categoryKey: string): void {
    const element = document.getElementById(categoryKey);
    if (element) {
      element.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }


  
  /**
   * Navigates to the video detail page for the selected video.
   * 
   * @param video - The video object containing the video details.
   */
  showVideo(video: any): void {
    console.log('Video:', video);
    this.router.navigate(['/video', video.id]);
  }
}