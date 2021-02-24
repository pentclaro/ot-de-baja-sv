import { Component, OnInit, Input } from '@angular/core';
import { Track } from 'ngx-audio-player';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  @Input() public title: string;
  @Input() public url: string;
  @Input() public controls: boolean;

  @Input() public displayTitle: boolean;
  @Input() public picture: string;
  @Input() public showTitle: boolean;
  msaapDisplayTitle = false;
  msaapDisplayPlayList = false;
  msaapPageSizeOptions = [];
  msaapDisplayVolumeControls = true;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = false;
  msaapPlaylist: Track[];
  constructor() { }

  ngOnInit(): void {
    this.msaapPlaylist = [{
      title: this.title,
      link: this.url,
      artist: 'Artist',
      duration: 3.4
    }];
  }

}
