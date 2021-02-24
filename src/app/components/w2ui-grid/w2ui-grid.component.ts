import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ColumnGroups, Columns, Item, Menu, SearchData, Searches, Show, Toolbar } from 'src/app/interfaces/interfaces';
import { Clipboard } from '@angular/cdk/clipboard';
import { HeaderService } from 'src/app/services/header.service';
import { SaveFileService } from 'src/app/services/save/save.service';
import * as $ from 'jquery';
import * as w2ui from 'w2ui';

declare var w2ui: any;
declare var $: any;
declare global {
  interface Window { w2uithat: any; }
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
  @Input() public columns: Columns[];
  @Input() public searches: Searches[];
  @Input() public sortData: any[];
  @Input() public records: any[];
  // @Input() public toolbar: Toolbar;
  @Input() public columnGroups: ColumnGroups[];
  @Input() public serachData: SearchData[];
  @Input() public menu: Menu[];
  private items: Item[];
  private toolbar: Toolbar;

  constructor(
    private excelService: SaveFileService,
    private pageService: HeaderService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    window.w2uithat = this;
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
    tableConfig.onMenuClick = function (event) {
      console.log(event);
    }

    if (this.show) { tableConfig.show = this.show }
    if (this.searches) { tableConfig.searches = this.searches }
    if (this.sortData) { tableConfig.sortData = this.sortData }
    if (this.columnGroups) { tableConfig.columnGroups = this.columnGroups }
    if (this.serachData) { tableConfig.serachData = this.serachData }
    if (this.menu) { tableConfig.menu = this.menu }
    if (this.records.length <= 18) {
      this.w2uiRefresh();
    }
    setTimeout(() => {
      $('#grid-' + this.name).w2grid(tableConfig);
    }, 100);
  }

  getShowedData(): any {
    w2ui[this.name].selectAll();
    let records = [];
    let selected = w2ui[this.name].getSelection();
    selected.map(function (mp) {
      records.push(w2ui[window.w2uithat.name].get(mp));
    });
    w2ui[this.name].selectNone();
    return records;
  }

  copyShowedData(): any {
    w2ui[this.name].selectAll();
    let copy = "";
    let selected = w2ui[this.name].getSelection();
    let init = true;
    selected.map(function (mp: any) {
      let row = w2ui[window.w2uithat.name].get(mp);
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
    this.items = [
      {
        type: 'button',
        id: 'item1',
        text: 'Excel',
        tooltip: function (event: any) {
          return 'Export to Excel';
        },
        onClick: function (event) {
          window.w2uithat.saveToExcel()
        }
      }, {
        type: 'button',
        id: 'item2',
        text: 'Copy',
        tooltip: 'Copy to Clipboard',
        onClick: function (event) {
          window.w2uithat.copyData();
        }
      }
    ]
    this.toolbar = { items: this.items };
  };

  saveToExcel() {
    let records = this.getShowedData();
    this.excelService.exportAsExcelFile(records, 'W2UI Data')
  }

  copyData() {
    let records = this.copyShowedData();
    this.clipboard.copy(records);
    this.pageService.openSnackBar(`success`, `Datos copiados al porta-papeles`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.records || changes.columns || changes.searches || changes.toolbar) {
      this.refresh();
    }
  }

  ngOnDestroy() {
    w2ui[this.name].destroy();
  }

}
