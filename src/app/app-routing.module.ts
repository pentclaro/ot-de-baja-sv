import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';
import { SidenavComponent } from './components/sidenav/sidenav.component';

const routes: Routes = [
  // { path: '', redirectTo: 'page', pathMatch: 'full' },
  {
    path: 'page', component: SidenavComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    // canActivate: [AuthGuard],
    data: {
      key: 'home'
    }
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
