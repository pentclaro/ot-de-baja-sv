import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { SaveFileService } from 'src/app/services/save/save.service';

declare var $: any;
// declare var that: any;
declare var google: any;
declare global {
  interface Window { that: any; }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-pivot-table',
  template: '<button (click)="download();">Descargar</button><div id="pivot-ngx-talbe" #ngxpivottable></div>',
  styles: ['::ng-deep .pvtFilterBox {position: absolute !important; left: 100px !important; top: 150px !important} .pvtAxisContainer li{padding: 4px 6px !important;}']
})
export class NgxPivotTableComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public useSubtotal: boolean;
  @Input() public useLocale: string;
  @Input() public pivotConfig: any;
  @Input() public ngModel: any;
  // @Input() public download: boolean;
  @Output() public pivotConfigOut = new EventEmitter<string>();
  that: any;
  prevModel: any;
  today: Date = new Date();

  constructor(
    private excelService: SaveFileService) { }
  @ViewChild('ngxpivottable', { static: true }) ngxpivottable: ElementRef;
  private isPivotInit: boolean;

  ngOnInit(): void {
    window.that = this;
    this.ngModel = !this.ngModel ? "" : this.ngModel;
    this.isPivotInit = true;
    this.pivotConfig = this.pivotConfig ? JSON.parse(this.pivotConfig) : {};
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data || changes.useSubtotal || changes.useLocale || (this.ngModel !== this.prevModel)) {
      this.render();
    }
  }

  download() {
    let table = document.getElementById('pivot-ngx-talbe').getElementsByClassName('pvtTable')[0];
    let data = this.tableToJson(table);
    this.excelService.exportAsExcelFile(data, 'Claro_template');

  }

  onPropagar(config) {
    this.prevModel = config;
    this.pivotConfigOut.emit(config);
  }

  getPivotOptions() {
    var config = $(this.ngxpivottable.nativeElement).data("pivotUIOptions");
    var config_copy = !config ? {} : JSON.parse(JSON.stringify(config));
    delete config_copy["aggregators"];
    delete config_copy["renderers"];
    this.onPropagar(JSON.stringify(config_copy));
  }

  private render() {
    google.load("visualization", "1", {packages:["corechart", "charteditor"]});
    if (this.isPivotInit) {
      var derivers = $.pivotUtilities.derivers;
      var renderers = $.extend(
        $.pivotUtilities.renderers,
        // $.pivotUtilities.plotly_renderers,
        $.pivotUtilities.gchart_renderers
      )
      debugger
      const data = this.data ? this.data : [];
      if (this.ngModel && data.length > 0) {
        this.pivotConfig = JSON.parse(this.ngModel);
      }
      this.pivotConfig.dataClass = this.useSubtotal ? $.pivotUtilities.SubtotalPivotData : undefined;
      this.pivotConfig.renderers = renderers;
      this.pivotConfig.rendererOptions = { gchart: { width: 1200, height: 1000 } }
      this.pivotConfig.localeStrings = {
        "renderError": "Ocurrió un error al mostrar los resultados de la tabla.", "computeError": "Ocurrió un error al computar los resultados de la tabla.", "uiRenderError": "Ocurrió un error en la UI de la tabla.", "selectAll": "Seleccionar todos", "selectNone": "Des-selecionar", "tooMany": "(demasiados datos para listar)", "filterResults": "Filtrar datos", "apply": "Aplicar", "cancel": "Cancelar", "Totals": "Totales", "totals": "Totales", "vs": "vs", "by": "por"
      }
      this.pivotConfig.onRefresh = function (config) {
        if (window.that.data.length > 0) {
          window.that.getPivotOptions();
        }
      }
      $(this.ngxpivottable.nativeElement).pivotUI(data, this.pivotConfig, true, this.useLocale);
      // $(this.ngxpivottable.nativeElement).pivotUI(function (injectRecord) {
      //   data.map(function (mp) {
      //     injectRecord({ a: mp.Age, b: mp.Name, c: mp.Province });
      //   });
      // }, this.pivotConfig, true, this.useLocale);
    }
  }

  tableToJson(table) {
    var data = [];

    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML;
    }

    for (var i = 1; i < table.rows.length; i++) {

      var tableRow = table.rows[i];
      var rowData = {};
      let blanks = headers.length - tableRow.cells.length;
      for (var j = 0; j < blanks; j++) {
        rowData[headers[j]] = "";
      }

      for (var j = 0; j < tableRow.cells.length; j++) {

        rowData[headers[(blanks > 0 ? blanks : 0) + j]] = tableRow.cells[j].innerHTML;

      }

      data.push(rowData);
    }
    return data;
  }
}
