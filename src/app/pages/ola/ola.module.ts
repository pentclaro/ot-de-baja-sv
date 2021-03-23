import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Routes, RouterModule } from '@angular/router';
import { NgProgressModule } from 'ngx-progressbar';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material-design';
import { OlaComponent } from './ola.component';


const routes: Routes = [
	{ path: '', component: OlaComponent },
	{ path: '', redirectTo: 'ola', pathMatch: 'full' },
];


@NgModule({
	declarations: [
		OlaComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		MaterialModule,
		MatPaginatorModule,
		NgProgressModule,
		ComponentsModule,
	]
})
export class OlaModule { }
