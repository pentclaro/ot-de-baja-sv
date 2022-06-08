import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GestionDocumentalComponent } from './gestion-documental.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-design';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
	{ path: '', component: GestionDocumentalComponent },
	{ path: '', redirectTo: 'gestion-documental', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    GestionDocumentalComponent
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
export class GestionDocumentalModule { }
