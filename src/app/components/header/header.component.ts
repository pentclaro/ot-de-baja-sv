import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() type: string;
  page: any = {
    icon: 'home',
    title: 'Home'
  };
  constructor(private pageService: HeaderService) { }

  ngOnInit() {
    this.getHeader();
    if (!this.type) {
      this.type = 'none';
    }
  }
  getHeader(): void {
    this.pageService.header
      .subscribe((arg: any) => this.page = arg);
  }
}
