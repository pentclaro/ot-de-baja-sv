import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  shouldRun = false;
  fillerNav: any[] = [
    {
      name: 'Inicio',
      route: './home',
      icon: 'home'
    },
    // {
    //   name: 'SLA`S',
    //   route: './company',
    //   icon: 'business'
    // },
    {
      name: 'OLA`S',
      route: './ola',
      icon: 'business'
    }, 
    // {
    //   name: 'Controles de seguridad',
    //   route: './temp',
    //   icon: 'business'
    // }, {
    //   name: 'Contratos',
    //   route: './temp',
    //   icon: 'business'
    // }, {
    //   name: 'Procesos SGI',
    //   route: './temp',
    //   icon: 'business'
    // }
		{
			name: 'Personal CNOC',
			route: './personal-cnoc',
			icon: 'view_comfortable'
		},
  ];
	dark: boolean = false;
	flag: any = {
		"1": "assets/flags/guatemala.svg",
		"2": "assets/flags/el-salvador.svg",
		"3": "assets/flags/honduras.svg",
		"4": "assets/flags/nicaragua.svg",
		"5": "assets/flags/costa-rica.svg",
		"6": "assets/flags/panama.svg"
	};

	currentTheme = 'default-theme';

	@HostBinding('class') componentCssClass;
	constructor(
		public overlayContainer: OverlayContainer,
		private authService: AuthenticationService,
		public router: Router,
		protected sanitizer: DomSanitizer,
		public dialog: MatDialog) {
	}
	ngOnInit() {
		this.shouldRun = true;
	}

	onSetTheme(): void {
		let theme = this.dark ? 'dark-theme' : 'ligth-theme';
		this.overlayContainer.getContainerElement().classList.remove(this.currentTheme);
		this.overlayContainer.getContainerElement().classList.add(theme);
		this.componentCssClass = theme;
		this.currentTheme = theme;
	}

	ngOnDestroy(): void {
	}

	logout() {
		this.authService.logout();
	}

	goToHelpCenter() {
		window.open('https://help.pentcloud.com', '_blank');
	}

	goToAccount() {
		this.router.navigate([`/page/account`]);
	}

}
