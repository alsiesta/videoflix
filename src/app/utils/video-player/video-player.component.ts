import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import videojs from 'video.js';
import { ChangeDetectorRef } from '@angular/core';
import Hls from 'hls.js'; // Import HLS.js for non-native HLS support

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoSrc!: string;  // Input to pass the video source URL
  @Input() video!: any; // Input to pass the video object
  player!: any;     // See this article, why i cannot cast it to videojs.Player: https://joeflateau.net/posts/video-js-heart-typescript using TypeScript
  hls!: Hls | undefined;
  @Input() autoplay: boolean = true;
  @Input() muted: boolean = true;
  @Input() loop: boolean = true;
  @Input() controls: boolean = true; // Show controls by default

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;



  constructor (private cdr: ChangeDetectorRef) { }

  ngOnInit () {
    this.initializePlayer();
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes['videoSrc'] && !changes['videoSrc'].isFirstChange()) {
      this.updatePlayerSource();
    }
    // Handle changes to player options if necessary
    if (changes['autoplay'] || changes['muted'] || changes['loop'] || changes['controls']) {
      if (this.player) {
        this.player.autoplay(this.autoplay);
        this.player.muted(this.muted);
        this.player.loop(this.loop);
        this.player.controls(this.controls);
      }
    }
  }


  initializePlayer () {
    this.player = videojs('my-video', {
      // controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
      autoplay: this.autoplay,
      muted: this.muted,
      loop: this.loop,
      controls: this.controls,
      preload: 'auto',
      // fluid: true, // Makes the player responsive
    });

    this.player.ready(() => {
      this.updatePlayerSource();
    });

    this.player.on('error', () => {
      console.error('VideoJS Error:', this.player.error());
    });
  }

  updatePlayerSource () {
    if (this.videoSrc) {
      this.player.src({
        src: this.videoSrc, // Video source URL
        type: 'application/x-mpegURL' // HLS video type
      });
    }
  }

  ngOnDestroy () {
    if (this.player) {
      this.player.dispose();
    }
  }
}