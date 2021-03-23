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
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    // canActivate: [AuthGuard],
    data: {
      key: 'home'
    }
  },
  {
    path: 'ola',
    loadChildren: () => import('./ola/ola.module').then(m => m.OlaModule),
    // canActivate: [AuthGuard],
    data: {
      key: 'ola'
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
