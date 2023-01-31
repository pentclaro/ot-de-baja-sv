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
    redirectTo: 'ot-de-baja-sv',
    pathMatch: 'full',
  },
  {
    path: 'ot-de-baja-sv',
    loadChildren: () =>
      import('./ot-de-baja-sv/ot-de-baja-sv.module').then(
        (m) => m.OtDeBajaSvCModule
      ),
    // canActivate: [AuthGuard],
    data: {
      key: 'ot-de-baja-sv',
    },
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
    RouterModule.forChild(routes),
  ],
})
export class PagesModule {}
