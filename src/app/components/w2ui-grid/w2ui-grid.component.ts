import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ColumnGroups, Column, Item, Menu, SearchData, Search, Show, Toolbar, Record, ColumnStyle } from 'src/app/interfaces/interfaces';
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
	styles: ['.grid-w2ui-claro {width: 100%;height: 500px;}']
})
export class W2uiGridComponent implements OnInit {
	@Input() public name: string;
	@Input() public header: string;
	@Input() public show: Show;
	@Input() public columns: Array<Column>;
	@Input() public searches: Array<Search>;
	@Input() public sortData: Array<any>;
	@Input() public records: Array<Record>;
	@Input() public columnGroups: Array<ColumnGroups>;
	@Input() public serachData: Array<SearchData>;
	@Input() public menu: Array<Menu>;
	@Input() public items: Array<Item> = [];
	@Input() public styles: Array<ColumnStyle> = [];
	@Input() public edit: boolean;
	@Input() public multiSelect: boolean = false;
	@Input() model: Record;
	@Output() modelChange: EventEmitter<Record> = new EventEmitter<Record>();
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
		}
		setTimeout(() => {
			$('#grid-' + this.name).w2grid(tableConfig);
		}, 100);
	}

	getShowedData(): Array<Record> {
		w2ui[this.name].selectAll();
		let data: Array<Record> = [];
		let selected = w2ui[this.name].getSelection();
		data = w2ui[this.name].get(selected);
		w2ui[this.name].selectNone();
		return data;
	}

	copyShowedData(): string {
		w2ui[this.name].selectAll();
		let copy: string = '';
		let data: Array<Record> = [];
		let selected = w2ui[this.name].getSelection();
		data = w2ui[this.name].get(selected);
		copy += `${Object.keys(data[0]).join('\t')}\r\n`;
		data.map(function (mp: any) {
			let row = Object.values(mp);
			copy += `${row.join('\t')}\r\n`;
		});
		w2ui[this.name].selectNone();
		return copy;
	}

	w2uiRefresh(): void {
		setTimeout(() => {
			w2ui[this.name].refresh();
		}, 300);
	}

	initActions(): void {
		let crud: Array<Item> = [];
		let actions: Array<Item> = [
			{
				type: 'break',
				id: "default-action",
				text: ""
			}, {
				type: 'button',
				id: 'default-excel',
				text: 'Excel',
				tooltip: 'Export to Excel',
				onClick: function (event: any) {
					window.W2uiGridComponent.saveToExcel()
				}
			}, {
				type: 'button',
				id: 'default-copy',
				text: 'Copy',
				tooltip: 'Copy to Clipboard',
				onClick: function (event: any) {
					window.W2uiGridComponent.copyData();
				}
			}
		];
		this.toolbar = { items: [...actions, ...crud, ...this.items] };
	};

	saveToExcel(): void {
		w2ui[this.name].multiSelect = true;
		let data: Array<Record> = this.getShowedData();
		this.excelService.exportAsExcelFile(data, this.header || 'Claro_template');
		w2ui[this.name].multiSelect = this.multiSelect;
	}

	copyData(): void {
		w2ui[this.name].multiSelect = true;
		let data: string = this.copyShowedData();
		this.clipboard.copy(data);
		this.pageService.openSnackBar(`success`, `Datos copiados al porta papeles`);
		w2ui[this.name].multiSelect = this.multiSelect;
	}

	setStyle(event: any): void {
		this.styles.map((style: ColumnStyle) => {
			$(`td#grid_${this.name}_column_${style.id}`).children(`div.w2ui-col-${style.type}`).css(style.style);
		})
	}

	emitValue(value: string): void {
		let row: any = undefined;
		if (value === 'select') {
			row = w2ui[this.name].getSelection();
			this.model = w2ui[this.name].get(row[0]);
			this.model = JSON.parse(JSON.stringify(this.model))
		} else {
			this.model = row;
		}
		this.modelChange.emit(this.model);
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
