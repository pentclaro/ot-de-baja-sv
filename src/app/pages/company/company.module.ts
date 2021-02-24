import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material-design';
import { FormsModule } from '@angular/forms';
import { CompanyComponent } from './company.component';
import { NgProgressModule } from 'ngx-progressbar';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { GoogleMapsModule } from '@angular/google-maps';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CompanyComponent },
  { path: '', redirectTo: 'company', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    CompanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    MatPaginatorModule,
    NgProgressModule,
    ComponentsModule,
    // GoogleMapsModule,
  ]
})
export class CompanyModule { }
