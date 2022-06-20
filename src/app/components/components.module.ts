import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-design';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageOkErrorComponent } from './message-ok-error/message-ok-error.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { HeaderComponent } from './header/header.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { NgxPivotTableComponent } from './ngx-pivot-table/ngx-pivot-table.component';
import { ChartCanvasComponent } from './chart-canvas/chart-canvas.component';
import { ChartsModule } from 'ng2-charts';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FileViewComponent } from './file-view/file-view.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { W2uiGridComponent } from './w2ui-grid/w2ui-grid.component';
import { W2uiGridComponentDetalle } from './w2ui-grid/w2ui-grid-detalle.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    SidenavComponent,
    MessageOkErrorComponent,
    PlaceholderComponent,
    HeaderComponent,
    SnackBarComponent,
    DeleteDialogComponent,
    NgxPivotTableComponent,
    ChartCanvasComponent,
    FormDialogComponent,
    ChangePasswordComponent,
    FileViewComponent,
    AudioPlayerComponent,
    W2uiGridComponent,
    W2uiGridComponentDetalle
  ],
  exports: [
    SidenavComponent,
    MessageOkErrorComponent,
    PlaceholderComponent,
    HeaderComponent,
    SnackBarComponent,
    DeleteDialogComponent,
    NgxPivotTableComponent,
    ChartCanvasComponent,
    FormDialogComponent,
    ChangePasswordComponent,
    FileViewComponent,
    AudioPlayerComponent,
    W2uiGridComponent,
    W2uiGridComponentDetalle
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    ChartsModule,
    NgxDocViewerModule,
    ClipboardModule,
    NgxAudioPlayerModule
  ],
  entryComponents: []
})

export class ComponentsModule { }
