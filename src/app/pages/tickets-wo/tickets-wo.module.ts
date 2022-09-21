import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TicketsWOComponent } from './tickets-wo.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material-design';

const routes: Routes = [
  { path: '', component: TicketsWOComponent },
  { path: '', redirectTo: 'tickets-wo', pathMatch: 'full' }
]
@NgModule({
  declarations: [
    TicketsWOComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    MatPaginatorModule,
    NgProgressModule,
    ComponentsModule
  ]
})
export class TicketsWoModule { }
