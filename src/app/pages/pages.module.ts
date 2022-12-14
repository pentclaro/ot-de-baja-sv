import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-design';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../guards/auth.guard';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'fallas-fibra-optica',
    pathMatch: 'full'
  },
  {
    path: 'fallas-fibra-optica',
    loadChildren: () => import('./fallas-fibra-optica/fallas-fibra-optica.module').then(m => m.FallasFibraOpticaModule),
    // canActivate: [AuthGuard],
    data: {
      key: 'fallas-fibra-optica'
    }
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ComponentsModule,
    HttpClientModule,
    NgProgressModule,
    MatPaginatorModule,
    RouterModule.forChild(routes)
  ],
})
export class PagesModule { }
