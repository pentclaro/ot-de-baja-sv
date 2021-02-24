import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {

  @Input() public url: string;
  @Input() public viewer: string;
  constructor() { }

  ngOnInit(): void {
  }

}
