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
    redirectTo: 'mg-operando-ey',
    pathMatch: 'full'
  },
  {
    path: 'mg-operando-ey',
    loadChildren: () => import('./mg-operando-ey/mg-operando-ey.module').then(m => m.MgOperandoEyModule),
    // canActivate: [AuthGuard],
    data: {
      key: 'mg-operando-ey'
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
