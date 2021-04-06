import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';

// import "dhtmlx-gantt";
import { gantt } from 'dhtmlx-gantt';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gantt',
  styleUrls: ['./gantt.component.scss'],
  template: `<div #draw_gantt class='gantt-chart'></div>`,
})
export class GanttComponent implements OnInit {
  // @Input() tasks: any;
  // @Input() links: Array<any> = [];
  // @Input() tasks: any;
  @ViewChild("draw_gantt", { static: true }) ganttContainer: ElementRef;
  tasks: any = [
    { id: 1, text: "Modulo/cara", type: gantt.config.types.project, open: true, render: "split", parent: 0 },
    { id: 9, text: "cara #1", color: "#000", start_date: "2020-04-15 00:00", end_date: "2020-04-18 23:59", parent: 1 },
    { id: 2, text: "cara #2", color: "bule", start_date: "2020-04-24 00:00", end_date: "2020-04-25 23:59", parent: 1 },
    { id: 3, text: "cara #3", color: "green", start_date: "2020-04-27 00:00", end_date: "2020-04-29 23:59", parent: 1 },
    { id: 4, text: "cara #4", color: "red", start_date: "2020-04-20 00:00", end_date: "2020-04-22 23:59", parent: 3 },
    { id: 5, text: "Modulo #5", color: "yellow", start_date: "2020-05-15 00:00", end_date: "2020-05-22 23:59", },
    { id: 6, text: "Modulo #6", color: "orange", start_date: "2020-06-18 00:00", end_date: "2020-06-22 23:59", },
    { id: 7, text: "cara #7", color: "gray", start_date: "2020-07-19 00:00", end_date: "2020-07-22 23:59", parent: 5 },
    { id: 8, text: "cara #8", color: "blue", start_date: "2020-08-20 00:00", end_date: "2020-08-22 23:59", parent: 6 },
  ]
  links: any = [
    // { id: 1, source: 1, target: 2, type: "0" }
  ]
  weekNo: number = 0;
  constructor() { }

  ngOnInit() {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.work_time = true;
    gantt.config.grid_resize = true;
    gantt.config.scale_height = 90;
    gantt.setWorkTime({ day: [1, 2, 3, 4, 5], hours: false });
    gantt.config.start_on_monday = false;
    gantt.i18n.setLocale("es");
    gantt.init(this.ganttContainer.nativeElement);
    gantt.config.columns = [
      { name: "text", label: "Módulo/Cara", tree: true, width: "*", min_width: 150, max_width: 300, },
      { name: "start_date", label: "Fecha inicial", align: "center", width: 100, min_width: 100, max_width: 160, },
      { name: "end_date", label: "Fecha final", align: "center", width: 100, min_width: 100, max_width: 160, },
      { name: "duration", label: "Duración", align: "center" }
    ];
    gantt.parse({ tasks: this.tasks, links: this.links });
    gantt.config.scales = [
      { unit: "month", step: 1, format: "%F, %Y" },
      {
        unit: "week", step: 2, format: function (date) {
          var dateToWeek = gantt.date.date_to_str("%W");
          var dateToStr = gantt.date.date_to_str("%d %M");
          // var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
          var endDate = gantt.date.add(gantt.date.add(date, 2, "week"), -1, "day");
          return "Catorcena " + dateToStr(date) + " a " + dateToStr(endDate);
        }
      },
      {
        unit: "day", step: 1, format: "%j %D", css: function (date) {
          if (!gantt.isWorkTime(date)) {
            return "week-end";
          }
        }
      }
    ];
    gantt.locale.labels.section_time = "Rango";
    gantt.locale.labels.section_description = "Nombre";
    gantt.locale.labels.days = "días";
    gantt.locale.labels.section_type = "Tipo"
    gantt.config.open_split_tasks = true;
    // gantt.config.lightbox.project_sections = [
    //   { name: "description", label:"Nombre", height: 70, map_to: "text", type: "textarea", focus: true },
    //   {
    //     name: "split", type: "checkbox", label: "Agrupar caras", map_to: "render", options: [
    //       { key: "split", label: "Agrupar" }
    //     ]
    //   },
    //   { name: "time", label: "Rango", type: "duration", readonly: true, map_to: "auto" }
    // ];
    // gantt.locale.labels.section_split = "Agrupar caras";
    // gantt.config.grid_resize = true;
    // gantt.refreshData();
    // gantt.resetLayout()
    gantt.eachTask(function (task) {
      task.$open = false;
    });
    setTimeout(() => {
    gantt.render();
    }, 2000);
  }

}
