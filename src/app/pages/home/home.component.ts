import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	currentUser: any;
	profile: any;
	picture: any;
	message: any;
	constructor(
		protected sanitizer: DomSanitizer) { }

  options: any[] = [
    // {
    //   name: 'SLA`S',
    //   title: 'SLA`S',
    //   description: 'Lorem ipsum dolor sit amet.',
    //   route: '/page/company',
    //   icon: 'business'
    // }, 
    {
      name: 'OLA`S',
      title: 'OLA`S',
      description: 'Lorem ipsum dolor sit amet.',
      route: '/page/ola',
      icon: 'business'
    }, 
    // {
    //   name: 'Controles de seguridad',
    //   title: 'Controles de seguridad',
    //   description: 'Lorem ipsum dolor sit amet.',
    //   route: '/page/company',
    //   icon: 'business'
    // }, {
    //   name: 'Contratos',
    //   title: 'Contratos',
    //   description: 'Lorem ipsum dolor sit amet.',
    //   route: '/page/company',
    //   icon: 'business'
    // }, {
    //   name: 'Procesos SGI',
    //   title: 'Procesos SGI',
    //   description: 'Lorem ipsum dolor sit amet.',
    //   route: '/page/company',
    //   icon: 'business'
    // }
  ];

	ngOnInit() {
	}

}
