import { Component, OnInit } from '@angular/core';
import {
  Column,
  Search,
  Show,
  Record,
  ColumnGroups,
  Item,
} from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
// import { MatDialog } from '@angular/material/dialog';
import { OtDeBajaSvService } from 'src/app/services/ot-de-baja-sv/ot-de-baja-sv.service';

@Component({
  selector: 'app-ot-de-baja-sv',
  templateUrl: './ot-de-baja-sv.component.html',
  styleUrls: ['./ot-de-baja-sv.component.scss'],
})
export class OtDeBajaSvComponent implements OnInit {
  search: {
    dateRange: { start: Date; end: Date };
  } = {
    dateRange: { start: new Date(), end: new Date() },
  };
  loading: boolean = false;
  loadingDetalle = false;
  updatedAt = '';
  reporteCargado = false;

  // w2ui de Cantidades
  dataSourceDetalle = [];
  orderDetalle: any;
  nameDetalle = 'ReporteOtdeBajasSv';
  headerDetalle = 'Resumen ot de bajas sv';
  showDetalle: Show = {
    toolbar: true,
    footer: true,
    header: false,
    toolbarColumns: false,
    toolbarInput: false,
    toolbarSearch: false,
    toolbarReload: false,
  };
  groupsDetalle: ColumnGroups[] = [];
  itemsDetalle: Item;
  searchesDetalle: Search[] = [];
  columnsDetalle: Column[] = [];

  constructor(
    private _pageService: HeaderService,
    private _otDeBajaSvService: OtDeBajaSvService
  ) {}

  ngOnInit(): void {}

  /* MÉTODO QUE SE EJECUTA CUANDO SE LE DA CLIC AL BOTÓN DE BUSCAR */
  searchData(): void {
    if (!this.search.dateRange.start || !this.search.dateRange.end) {
      this._pageService.openSnackBar(
        `warning`,
        `Error selecciona un rango de fecha.`
      );
      return;
    }
    this.updatedAt = Date();
    this.reporteCargado = true;
    this.getTableDetalle(this.search);
  }

  /* MÉTODO QUE CARGA DATOS DE TABLA DE PROMEDIOS Y SE MANEJA LA INFORMACIÓN PARA LA TABLA W2UI */
  getTableDetalle(search?) {
    this.loadingDetalle = true;
    this.loading = true;
    // this.dataSourceDetalle = [];
    this._otDeBajaSvService.getOtDeBajaSv(search).subscribe(
      ({ data, message }: any) => {
        this.orderDetalle = data.order;
        let datos = data.data;
        console.log({ datos });
        this.updatedAt = Date();
        this.dataSourceDetalle = this.orderKeys(datos, data.info);
        this.format();
        this.loading = false;
      },
      (error) => {
        this._pageService.openSnackBar('error', error);
        this.loading = false;
        this.loadingDetalle = false;
        this.dataSourceDetalle = [];
        this.format(true);
      }
    );
  }

  format(noData: boolean = false): void {
    let data = [];
    //* el parametro no data se pasa como true cuando no hay registros en la consulta y se llenan unicamente los encabezados de la tabla
    if (!noData) {
      data = this.orderDetalle;
    } else {
      data = [
        'CATEGORY',
        'OT',
        'AREA_CIERRE',
        'FECHA_APERTURA',
        'FECHA_CIERRE',
        'TIPO',
        'TIPO EJECUCION',
        'TITULO',
        'ESTADO',
      ];
    }
    this.loadingDetalle = true;
    this.searchesDetalle = [];
    this.columnsDetalle = [];
    data.map((key: string) => {
      let col: Column, search: Search;
      if (key === 'recid') {
        col = {
          field: key,
          text: key,
          size: '50px',
          frozen: false,
          sortable: true,
          // hidden: true,
        };
      } else if (key === 'CATEGORY') {
        col = {
          field: key,
          text: key,
          size: '130px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'AREA_CIERRE') {
        col = {
          field: key,
          text: key,
          size: '200px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'FECHA_APERTURA') {
        col = {
          field: key,
          text: key,
          size: '150px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'FECHA_CIERRE') {
        col = {
          field: key,
          text: key,
          size: '150px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'TIPO EJECUCION') {
        col = {
          field: key,
          text: key,
          size: '150px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'TITULO') {
        col = {
          field: key,
          text: key,
          size: '500px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else {
        col = { field: key, text: key, size: '80px', sortable: true };
      }
      this.columnsDetalle.push(col);
      if (key === 'recid') {
        search = { field: key, label: key, type: 'int', hidden: true };
      } else {
        search = { field: key, label: key, type: 'text' };
      }
      this.searchesDetalle.push(search);
    });
    this.loadingDetalle = false;
  }
  orderKeys(data: Record[], info: string[]): Record[] {
    let rowsArray = [];
    info = ['recid', ...info];
    if (Array.isArray(data)) {
      data.map((element) => {
        let infoRow = {};
        info.map((key) => {
          infoRow[key] = element[key];
        });
        rowsArray.push({
          ...infoRow,
        });
      });
    }
    this.loadingDetalle = false;
    return rowsArray;
  }
}
