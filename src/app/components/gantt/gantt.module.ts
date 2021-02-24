import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt.component';

@NgModule({
  declarations: [GanttComponent],
  imports: [
    CommonModule
  ],
  exports: [GanttComponent]
})
export class GanttModule { }
