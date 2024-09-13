import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoSrc!: string;  // Input to pass the video source URL
  player!: any;     // See this article, why i cannot cast it to videojs.Player: https://joeflateau.net/posts/video-js-heart-typescript using TypeScript

  ngOnInit() {
    this.initializePlayer();
  }

  initializePlayer () {
    this.player = videojs('my-video', {
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
     
    });

    // Optional: Handle events
    this.player.on('loadedmetadata', () => {
      console.log('HLS video loaded with metadata.');
    });

    this.player.on('resolutionchange', () => {
      console.log('Resolution changed to:', this.player.currentResolution());
    });

    // this.player.httpSourceSelector();

    this.player.src({
      src: this.videoSrc,
      type: 'application/x-mpegURL' // HLS video type
    });
  }

  

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}