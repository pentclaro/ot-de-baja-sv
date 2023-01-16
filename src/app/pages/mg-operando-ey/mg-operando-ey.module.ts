import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MgOperandoEyComponent } from './mg-operando-ey.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-design';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: MgOperandoEyComponent },
  { path: '', redirectTo: 'mg-operando-ey', pathMatch: 'full' }
]
@NgModule({
  declarations: [
    MgOperandoEyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
		FormsModule,
    ReactiveFormsModule,
		MaterialModule,
    MatPaginatorModule,
		NgProgressModule,
		ComponentsModule
  ]
})
export class MgOperandoEyModule { }
