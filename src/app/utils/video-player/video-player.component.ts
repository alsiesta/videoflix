import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import videojs from 'video.js';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoSrc!: string;  // Input to pass the video source URL
  @Input() video!: any; // Input to pass the video object
  player!: any;     // See this article, why i cannot cast it to videojs.Player: https://joeflateau.net/posts/video-js-heart-typescript using TypeScript

  constructor (private cdr: ChangeDetectorRef) { }
  
  ngOnInit() {
    this.initializePlayer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoSrc'] && !changes['videoSrc'].isFirstChange()) {
      this.updatePlayerSource();
    }
  }


  initializePlayer () {
    this.player = videojs('my-video', {
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
    });

    this.player.ready(() => {
      this.updatePlayerSource();
    });

    this.player.on('error', () => {
      console.error('VideoJS Error:', this.player.error());
    });
  }

  updatePlayerSource() {
    if (this.videoSrc) {
      this.player.src({
        src: this.videoSrc, // Video source URL
        type: 'application/x-mpegURL' // HLS video type
      });
    }
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}