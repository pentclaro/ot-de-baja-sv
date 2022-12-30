import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FallasFibraOpticaComponent } from './fallas-fibra-optica.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-design';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopupTablaComponent } from './popup-tabla/popup-tabla.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: FallasFibraOpticaComponent },
  { path: '', redirectTo: 'fallas-fibra-optica', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    FallasFibraOpticaComponent,
    PopupTablaComponent,
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
export class FallasFibraOpticaModule { }
