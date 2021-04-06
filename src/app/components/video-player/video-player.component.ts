import { Component, OnInit, ViewChild, Renderer2, Input, SimpleChanges } from '@angular/core';
// import { MatVideoComponent } from 'mat-video/lib/video.component';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('video', { static: false }) matVideo: any;
  video: HTMLVideoElement;
  @Input() public subtitles: Array<any> = [];
  @Input() public title: string;
  @Input() public src: string;
  @Input() public showTitle: boolean;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.video = this.matVideo.getVideoTag();
    this.renderer.listen(this.video, 'ended', () => console.log('video ended'));
    this.video.addEventListener('ended', () => console.log('video ended'));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.video = this.matVideo.getVideoTag();
    this.renderer.listen(this.video, 'ended', () => console.log('video ended'));
    this.video.addEventListener('ended', () => console.log('video ended'));
  }
  
}
