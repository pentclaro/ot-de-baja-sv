import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ColumnGroups, Column, Item, Menu, SearchData, Search, Show, Toolbar, Record, ColumnStyle, SelectType } from 'src/app/interfaces/interfaces';
import { Clipboard } from '@angular/cdk/clipboard';
import { HeaderService } from 'src/app/services/header.service';
import { SaveFileService } from 'src/app/services/save/save.service';
import * as $ from 'jquery';
import * as w2ui from '@derekyle/w2ui';

declare const w2ui: any;
declare const $: any;
declare global {
	interface Window { W2uiGridComponent: any; }
}
@Component({
	selector: 'app-w2ui-grid',
	template: '<div id="grid-{{name}}" class="gird- ng-custom-ui grid-w2ui-claro"></div>',
	styles: ['.grid-w2ui-claro {width: 100%; height: 500px;}']
})
export class W2uiGridComponent implements OnInit {
	@Input() name: string;
	@Input() header: string;
	@Input() show: Show;
	@Input() columns: Array<Column>;
	@Input() searches: Array<Search>;
	@Input() sortData: Array<any>;
	@Input() records: Array<Record>;
	@Input() columnGroups: Array<ColumnGroups>;
	@Input() serachData: Array<SearchData>;
	@Input() menu: Array<Menu>;
	@Input() items: Array<Item> = [];
	@Input() styles: Array<ColumnStyle> = [];
	@Input() edit: boolean;
	@Input() multiSelect: boolean = false;
	@Input() selectType: SelectType = 'row'
	@Input() model: Record;
	@Input() modelDbl: Record;
	@Output() modelChange: EventEmitter<Record> = new EventEmitter<Record>();
	@Output() modelDblChange: EventEmitter<Record> = new EventEmitter<Record>();
	private toolbar: Toolbar;

	constructor(
		private excelService: SaveFileService,
		private pageService: HeaderService,
		private clipboard: Clipboard
	) { }

	ngOnInit(): void {
		window.W2uiGridComponent = this;
		this.initActions();
		this.initTable();
	}

	refresh(): void {
		if (w2ui.hasOwnProperty(this.name)) {
			if ($('#grid-' + this.name).length >= 1) {
				w2ui[this.name].destroy();
				this.initTable();
			} else {
				this.initTable();
			}
		} else {
			this.initTable();
		}
	}

	initTable(): void {
		this.initActions();
		let tableConfig: any = {};
		tableConfig.name = this.name;
		tableConfig.header = this.header;
		tableConfig.columns = this.columns;
		tableConfig.records = this.records;
		tableConfig.toolbar = this.toolbar;
		tableConfig.multiSelect = this.multiSelect;

		if (this.show) { tableConfig.show = this.show }
		if (this.searches) { tableConfig.searches = this.searches }
		if (this.sortData) { tableConfig.sortData = this.sortData }
		if (this.columnGroups) { tableConfig.columnGroups = this.columnGroups }
		if (this.serachData) { tableConfig.serachData = this.serachData }
		if (this.menu) { tableConfig.menu = this.menu }
		if (this.selectType) { tableConfig.selectType = this.selectType }
		if (this.styles.length > 0) {
			tableConfig.onRefresh = function (event: any) { window.W2uiGridComponent.setStyle(event) }
			tableConfig.onResize = function (event: any) { window.W2uiGridComponent.setStyle(event) }
			tableConfig.onColumnOnOff = function (event: any) { window.W2uiGridComponent.setStyle(event) }
			tableConfig.onReload = function (event: any) { window.W2uiGridComponent.setStyle(event) }
			tableConfig.onSearch = function (event: any) { window.W2uiGridComponent.setStyle(event) }
			tableConfig.onSort = function (event: any) { window.W2uiGridComponent.setStyle(event) }
		}
		if (this.edit) {
			tableConfig.onSelect = (event: any) => { event.onComplete = (event: any) => { window.W2uiGridComponent.emitValue('select') } }
			tableConfig.onUnselect = (event: any) => { event.onComplete = (event: any) => { window.W2uiGridComponent.emitValue('unselect') } }
			tableConfig.onDblClick = (event: any) => { event.onComplete = (event: any) => { window.W2uiGridComponent.emitValueDbl()}}
			// tableConfig.onDblClick = (event: any) => { window.W2uiGridComponent.emitValueDbl()	}
		}
		setTimeout(() => {
			$('#grid-' + this.name).w2grid(tableConfig);
		}, 100);
	}

  /* MÉTODO PARA OBTENER DATOS DE TABLA, DEVUELVE ARRAY DE DATOS */
	getShowedData(table): Array<Record> {// Se espera como parámetro el nombre de la tabla para seleccionarla
		let data: Array<Record> = [];
    if (table.selectType === 'row') {// Revisa si el método de selección de la tabla es por fila
      table.selectAll();
      let selected = table.getSelection();
      data = table.get(selected);
    } else {// Si el método de selección es por celda se ejecuta esta parte para obtener los datos
      const recid = []
      table.records.map(item => {
        recid.push(item.recid)
      })
      let selected = recid
      data = table.get(selected);
    }
    table.selectNone();// Al finalizar el método de de selección, se deselecciona todo y retorna los datos
		return data;
	}

  /* MÉTODO QUE SELECCIONA LOS DATOS Y LOS COPIA EN EL PORTAPAPELES */
	copyShowedData(table): string {// Se espera como parámetro el nombre de la tabla para seleccionarla
		let copy: string = '';
    let data: Array<Record> = [];
    if (table.selectType === 'row') {// Revisa si el método de selección de la tabla es por fila
      table.selectAll();
      let selected = table.getSelection();
      data = table.get(selected);
    } else {// Si el método de selección es por celda se ejecuta esta parte para obtener los datos
      const recid = []
      table.records.map(item => {
        recid.push(item.recid)
      })
      let selected = recid
      data = table.get(selected);
    }
    copy += `${Object.keys(data[0]).join('\t')}\r\n`;// Inserta en la variable copy los títulos de la data
    data.map(function (mp: any) {// Iteración para insertar las filas de la data en el portapapeles
      let row = Object.values(mp);
      copy += `${row.join('\t')}\r\n`;
    });
		table.selectNone();// Se deselecciona la data y retornamos la variable copy
		return copy;
	}

	w2uiRefresh(): void {
		setTimeout(() => {
			w2ui[this.name].refresh();
		}, 300);
	}

	initActions(): void {
		let crud: Array<Item> = [];
		let actions: Array<Item> = [// Botones de toolbar
			{
				type: 'break',
				id: "default-action",
				text: ""
			}, {// Botón de descarga de Excel
				type: 'button',
				id: 'default-excel',
				text: 'Excel',
				tooltip: 'Export to Excel',
				onClick: function (event: any) {// Función de disparador de clic en botón
					window.W2uiGridComponent.saveToExcel(w2ui[this.name].owner)// Se ejecuta la función saveToExcel enviando como parámetro el nombre de tabla
				}
			}, {// Botón de copiado de contenido al portapapeles
				type: 'button',
				id: 'default-copy',
				text: 'Copy',
				tooltip: 'Copy to Clipboard',
				onClick: function (event: any) {// Función de disparador de clic en botón
					window.W2uiGridComponent.copyData(w2ui[this.name].owner);// Se ejecuta el método copyData y se envía como parámetro el nombre de tabla
				}
			},
			// {
			// 	type: 'button',
			// 	id: 'default-popup',
			// 	text: 'Mostrar Detalle',
			// 	tooltip: 'Muestra el detalle del ticket seleccionado',
			// 	onClick: function(event: any) {
			// 		console.log('abre popup')
			// 	}
			// }
		];
		this.toolbar = { items: [...actions, ...crud, ...this.items] };// Se inserta todos los items al toolbar de la tabla
	};

  /* MÉTODO DE DESCARGA DE ARCHIVO EXCEL CON CONTENIDO DE TABLA */
	saveToExcel(table): void {// Recibe como parámetro el nombre de una tabla
		table.multiSelect = true;// Le activa el multiselect a la tabla seleccionada
		let data: Array<Record> = this.getShowedData(table);// Guardamos los datos que contiene la tabla en la variable data
		this.excelService.exportAsExcelFile(data, table.header || 'Claro_template');// Se ejecuta el método exportAsExcelFile para crear archivo excel
		table.multiSelect = table.multiSelect;
	}

  /* MÉTODO DE COPIADO DE CONTENIDO DE TABLA AL PORTAPAPELES */
	copyData(table): void {// Recibe como parámetro el nombre de una tabla
		table.multiSelect = true;// Le activa el multiselect a la tabla seleccionada
		let data: string = this.copyShowedData(table);
		this.clipboard.copy(data);
		this.pageService.openSnackBar(`success`, `Datos copiados al porta papeles`);
		table.multiSelect = table.multiSelect;
	}

	setStyle(event: any): void {
		this.styles.map((style: ColumnStyle) => {
			$(`td#grid_${this.name}_column_${style.id}`).children(`div.w2ui-col-${style.type}`).css(style.style);
		})
	}

	emitValue(value: string): void {
    // console.log(w2ui)
		if (this.selectType === 'row') {
			let row: any = undefined;
			if (value === 'select') {
				row = w2ui[this.name].getSelection();
				console.log(row)
				this.model = w2ui[this.name].get(row[0]);
				this.model = JSON.parse(JSON.stringify(this.model))
			} else {
				this.model = row;
			}
		} else {
			let cell: any = undefined;
			if (value === 'select') {
				cell = w2ui[this.name].getSelection()
				this.model = w2ui[this.name].getCellValue(cell[0].index, cell[0].column)
				this.model = JSON.parse(JSON.stringify(this.model))
			} else {
				this.model = cell
			}
		}
		this.modelChange.emit(this.model);
	}

	emitValueDbl(): void {
		if (this.selectType === 'row') {
			let row: any = undefined;
			row = w2ui[this.name].getSelection();
			this.modelDbl = w2ui[this.name].get(row[0]);
			this.modelDbl = JSON.parse(JSON.stringify(this.modelDbl))
		} else {
			let cell: any = undefined;
			cell = w2ui[this.name].getSelection()
			this.modelDbl = w2ui[this.name].getCellValue(cell[0].index, cell[0].column)
			this.modelDbl = JSON.parse(JSON.stringify(this.modelDbl))
		}
		this.modelDblChange.emit(this.modelDbl);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.records || changes.columns || changes.searches || changes.toolbar || changes.columnGroups || changes.styles) {
			this.refresh();
		}
	}

	ngOnDestroy() {
		w2ui[this.name].destroy();
	}

}
