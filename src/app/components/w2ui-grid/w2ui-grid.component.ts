import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ColumnGroups, Column, Item, Menu, SearchData, Search, Show, Toolbar, Record, ColumnStyle } from 'src/app/interfaces/interfaces';
import { Clipboard } from '@angular/cdk/clipboard';
import { HeaderService } from 'src/app/services/header.service';
import { SaveFileService } from 'src/app/services/save/save.service';
import * as $ from 'jquery';
// import * as w2ui from 'src/assets/vendor/w2ui';
import * as w2ui from '@derekyle/w2ui';

declare var w2ui: any;
declare var $: any;
declare global {
  interface Window { W2uiGridComponent: any; }
}
@Component({
  selector: 'app-w2ui-grid',
  templateUrl: './w2ui-grid.component.html',
  styleUrls: ['./w2ui-grid.component.scss']
})
export class W2uiGridComponent implements OnInit {
  @Input() public name: string;
  @Input() public header: string;
  @Input() public show: Show;
  @Input() public columns: Column[];
  @Input() public searches: Search[];
  @Input() public sortData: any[];
  @Input() public records: Record[];
  // @Input() public toolbar: Toolbar;
  @Input() public columnGroups: ColumnGroups[];
  @Input() public serachData: SearchData[];
  @Input() public menu: Menu[];
  @Input() public items: Item[] = [];
  @Input() public styles: ColumnStyle[] = [];
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
    tableConfig.onMenuClick = function (event: any) {
      console.log(event);
    }

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
      tableConfig.onScroll = function (event: any) { window.W2uiGridComponent.setStyle(event) }
    }
    setTimeout(() => {
      $('#grid-' + this.name).w2grid(tableConfig);
    }, 100);
  }

  getShowedData(): Record[] {
    w2ui[this.name].selectAll();
    let data: Record[] = [];
    let selected = w2ui[this.name].getSelection();
    selected.map(function (mp: any) {
      data.push(w2ui[window.W2uiGridComponent.name].get(mp));
    });
    w2ui[this.name].selectNone();
    return data;
  }

  copyShowedData(): string {
    w2ui[this.name].selectAll();
    let copy: string = '';
    let selected = w2ui[this.name].getSelection();
    let init: boolean = true;
    selected.map(function (mp: any) {
      let row = w2ui[window.W2uiGridComponent.name].get(mp);
      if (init) {
        for (let key in row) {
          copy += key + "\t";
        }
        copy += "\r\n";
        init = false;
      }
      for (let key in row) {
        copy += row[key] + "\t";
      }
      copy += "\r\n";
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
    let actions: Item[] = [
      {
        type: 'break',
        id: "default-action",
        text: ""
      },
      {
        type: 'button',
        id: 'item1',
        text: 'Excel',
        tooltip: 'Export to Excel',
        onClick: function (event: any) {
          window.W2uiGridComponent.saveToExcel()
        }
      }, {
        type: 'button',
        id: 'item2',
        text: 'Copy',
        tooltip: 'Copy to Clipboard',
        onClick: function (event: any) {
          window.W2uiGridComponent.copyData();
        }
      }
    ];
    this.toolbar = { items: [...actions, ...this.items] };
  };

  saveToExcel(): void {
    let data: Record[] = this.getShowedData();
    this.excelService.exportAsExcelFile(data, 'W2UI Data')
  }

  copyData(): void {
    let data: string = this.copyShowedData();
    this.clipboard.copy(data);
    this.pageService.openSnackBar(`success`, `Datos copiados al porta-papeles`);
  }

  setStyle(event: any): void {
    this.styles.map((style: ColumnStyle) => {
      $(`td#grid_${this.name}_column_${style.id}`).children(`div.w2ui-col-${style.type}`).css(style.style);
    })
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
