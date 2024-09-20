// background-video.component.ts
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import videojs from 'video.js';
import { ChangeDetectorRef } from '@angular/core';
import Hls from 'hls.js'; // Import HLS.js for non-native HLS support

@Component({
  selector: 'app-background-video',
  templateUrl: './background-video.component.html',
  styleUrls: ['./background-video.component.scss']
})
export class BackgroundVideoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() videoSrc!: string;  // Input to pass the video source URL

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  player!: any;
  hls!: Hls | undefined;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.initializePlayer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoSrc'] && !changes['videoSrc'].isFirstChange()) {
      this.updatePlayerSource();
    }
  }

  initializePlayer() {
    this.player = videojs('bgvideo', {
      autoplay: true,
      muted: true,
      loop: true,
      controls: false, // Hide controls for background video
      preload: 'auto',
      // fluid: true, // Responsive
      // Additional Video.js options if needed
    });

    this.player.ready(() => {
      this.updatePlayerSource();
    });

    this.player.on('error', () => {
      console.error('Background VideoJS Error:', this.player.error());
    });
  }

  updatePlayerSource() {
    if (this.videoSrc) {
      this.player.src({
        src: this.videoSrc,
        type: 'application/x-mpegURL' // HLS video type
      });
      this.player.play().catch((error: Error) => {
        console.error('Autoplay was prevented:', error);
      });
    }
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
