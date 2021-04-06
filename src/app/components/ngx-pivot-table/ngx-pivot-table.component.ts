import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SaveFileService } from 'src/app/services/save/save.service';

declare const $: any;
declare const google: any;
declare global {
	interface Window { NgxPivotTableComponent: any; }
}
@Component({
	selector: 'ngx-pivot-table',
	template: '<button (click)="download();">Descargar</button><div id="pivot-ngx-talbe" class="scroll" #ngxpivottable></div>',
	styles: ['#pivot-ngx-talbe{width: 100%; height: auto}']
})
export class NgxPivotTableComponent implements OnInit, OnChanges {
	@Input() public data: Array<any>;
	@Input() public title: string;
	@Input() public model: string;
	@Output() public modelChange: EventEmitter<string> = new EventEmitter<string>();

	public pivotConfig: any;
	private isPivotInit: boolean;

	@ViewChild('ngxpivottable', { static: true }) ngxpivottable: ElementRef;
	constructor(
		private excelService: SaveFileService) { }

	ngOnInit(): void {
		window.NgxPivotTableComponent = this;
		this.model = !this.model ? "" : this.model;
		this.isPivotInit = true;
		this.pivotConfig = this.pivotConfig ? JSON.parse(this.pivotConfig) : {};
		this.render();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.data || changes.model) {
			this.render();
		}
	}

	download() {
		let doom: HTMLElement = document.getElementById('pivot-ngx-talbe');
		let table: Element = doom.getElementsByClassName('pvtTable')[0];
		this.excelService.exportTableAsExcelFile(table, this.title || 'Claro_template');
	}

	onPropagar(config: any) {
		this.model = JSON.stringify(config);
		this.modelChange.emit(this.model);
	}

	getPivotOptions() {
		const config = $(this.ngxpivottable.nativeElement).data("pivotUIOptions");
		let configCopy = !config ? {} : JSON.parse(JSON.stringify(config));
		delete configCopy["aggregators"];
		delete configCopy["renderers"];
		delete configCopy["rendererOptions"];
		delete configCopy["localeStrings"];
		this.onPropagar(configCopy);
	}

	private render() {
		google.load("visualization", "1", { packages: ["corechart", "charteditor"] });
		if (this.isPivotInit) {
			const renderers = $.extend(
				$.pivotUtilities.renderers,
				$.pivotUtilities.gchart_renderers
			)
			const data = this.data ? this.data : [];
			if (this.model && data.length > 0) {
				this.pivotConfig = JSON.parse(this.model);
			}
			this.pivotConfig.dataClass = undefined;
			this.pivotConfig.renderers = renderers;
			this.pivotConfig.rendererOptions = { gchart: { width: 1200, height: 1000 } }
			this.pivotConfig.localeStrings = {
				"renderError": "Ocurrió un error al mostrar los resultados de la tabla.", "computeError": "Ocurrió un error al computar los resultados de la tabla.", "uiRenderError": "Ocurrió un error en la UI de la tabla.", "selectAll": "Seleccionar todos", "selectNone": "Deselecionar", "tooMany": "(demasiados datos para listar)", "filterResults": "Filtrar datos", "apply": "Aplicar", "cancel": "Cancelar", "Totals": "Totales", "totals": "Totales", "vs": "vs", "by": "por"
			}
			this.pivotConfig.rendererOptions.localeStrings = this.pivotConfig.localeStrings;
			this.pivotConfig.onRefresh = (config: any) => {
				if (window.NgxPivotTableComponent.data.length > 0) {
					window.NgxPivotTableComponent.getPivotOptions();
				}
			}
			$(this.ngxpivottable.nativeElement).pivotUI(data, this.pivotConfig, true);
			// $(this.ngxpivottable.nativeElement).pivotUI((injectRecord) => {
			//   data.map((mp) => {
			//     injectRecord({ a: mp.Age, b: mp.Name, c: mp.Province });
			//   });
			// }, this.pivotConfig, true, this.useLocale);
		}
	}

	tableToJson(table: any): Array<any> {
		let data: Array<any> = [];
		let headers: Array<any> = [];
		for (let i = 0; i < table.rows[0].cells.length; i++) {
			headers[i] = table.rows[0].cells[i].innerHTML;
		}

		for (let i = 1; i < table.rows.length; i++) {
			let tableRow = table.rows[i];
			let rowData = {};
			let blanks = headers.length - tableRow.cells.length;

			for (let j = 0; j < blanks; j++) {
				rowData[headers[j]] = "";
			}

			for (let j = 0; j < tableRow.cells.length; j++) {
				rowData[headers[(blanks > 0 ? blanks : 0) + j]] = tableRow.cells[j].innerHTML;
			}

			data.push(rowData);
		}
		return data;
	}
}
