import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import {
  Column,
  Search,
  Show,
  Record,
  ColumnGroups,
  Item,
} from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
import { MatDialog } from '@angular/material/dialog';
import { MgOperandoEyService } from 'src/app/services/mg-operando-ey/mg-operando-ey.service';
import { FaultMgOperandoService } from 'src/app/services/fault/fault.service';

@Component({
  selector: 'app-mg-operando-ey',
  templateUrl: './mg-operando-ey.component.html',
  styleUrls: ['./mg-operando-ey.component.scss'],
})
export class MgOperandoEyComponent implements OnInit {
  paises: string[] = [
    'Regional',
    'Guatemala',
    'El Salvador',
    'Honduras',
    'Nicaragua',
    'Costa Rica',
  ];
  regiones: string[] = [];
  search: {
    pais: string;
    region: string[];
    dateRange: { start: Date; end: Date };
  } = {
    pais: '',
    region: [],
    dateRange: { start: new Date(), end: new Date() },
  };
  loading: boolean = false;
  loadingDetalle = false;
  updatedAt = '';
  reporteCargado = false;
  tituloReporte = 'Reporte MG Operando';

  // w2ui de Cantidades
  dataSourceDetalle = [];
  orderDetalle: any;
  nameDetalle = 'ReporteMgOperando';
  headerDetalle = 'Resumen mg operando';
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

  areAllRegionsSelected: boolean = false;
  @ViewChild('form', { static: false }) form: NgForm;

  constructor(
    private _pageService: HeaderService,
    private _mgOperandoEyService: MgOperandoEyService,
    private _faultMgOperando: FaultMgOperandoService
  ) {}

  ngOnInit(): void {}

  /* MÉTODO PARA DETECTAR SELECCION DEL USUARIO EN CUALQUIER INPUT */
  optionSelected(input): void {
    this.tituloReporte = 'MG Operando'; // Cambiamos el título de las primeras partes del reporte sino es Metro Sur
    if (input === this.search.pais) {
      // FRAGMENTO ESPECIFICO DEL FILTRO DE PAIS
      if (this.search.pais !== 'Regional') {
        this.loadingDetalle = true;
        this.getDataRegiones(this.search.pais);
        this.loadingDetalle = false;
        this.regiones.push('Region1');
        this.regiones.push('Region2');
        this.regiones.push('Region3');
        this.regiones.push('Region4');
        this.regiones.push('Region5');
        this.regiones.push('Region6');
        this.regiones.unshift('Todas');
      } else {
        this.search.region = [];
        this.regiones = [];
      }
    } else {
      if (this.areAllRegionsSelected) {
        this.search.region = [];
        this.areAllRegionsSelected = false;
      } else {
        if (input.includes('Todas')) {
          this.search.region = this.regiones;
          this.areAllRegionsSelected = true;
        }
      }
    }
    console.log('regions selected', this.search.region);
  }

  /* MÉTODO QUE SE EJECUTA CUANDO SE LE DA CLIC AL BOTÓN DE BUSCAR */
  searchData(form): void {
    // console.log('start date', this.search.dateRange.start.toLocaleDateString());
    // console.log('end date', this.search.dateRange.end.toLocaleDateString());

    if (!this.search.dateRange.start || !this.search.dateRange.end){
      this._pageService.openSnackBar(
        `warning`,
        `Error selecciona todos los campos.`
      );
      return
    }
    this.loading = true;
    this.loadingDetalle = true;
    this.form.form.markAllAsTouched();
    if (this.form.valid) {
      this.loadingDetalle = true;
      this.updatedAt = Date();
      this.reporteCargado = true;
      this.getTableDetalle(this.search);
    } else {
      this._pageService.openSnackBar(
        `warning`,
        `Error selecciona todos los campos.`
      );
      this.loading = false;
      this.reporteCargado = false;
      this.loadingDetalle = false;
    }
  }

  /* MÉTODO QUE CARGA E INSERTA DENTRO DEL INPUT DE REGIONES AL SELECCIONAR UN PAÍS */
  getDataRegiones(pais: string) {
    //console.log('regiones')
    this.regiones = [];
    this._faultMgOperando.getDataRegiones(pais).subscribe(
      (data: any) => {
        data.map((region) => {
          this.regiones.push(region.TG_TIPO_SITIO);
        });
        this.regiones.unshift('TODAS');
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this._pageService.openSnackBar(
          'error',
          'No se obtuvieron regiones del país seleccionado',
          1800
        );
      }
    );
  }

  /* MÉTODO QUE CARGA DATOS DE TABLA DE PROMEDIOS Y SE MANEJA LA INFORMACIÓN PARA LA TABLA W2UI */
  getTableDetalle(search?) {
    this._mgOperandoEyService.getTableDetalle(search).subscribe(
      ({ data, message }: any) => {
        this.orderDetalle = data.order;
        let datos = data.data;
        this.updatedAt = Date();
        this.dataSourceDetalle = this.orderKeys(datos, data.info);
        this.format();

        let fechas = [];
        let cantidades = [];
        let promedios = [];
      },
      (error) => {
        this._pageService.openSnackBar('error', error);
        this.loading = false;
        this.loadingDetalle = false;
      }
    );
  }

  format(): void {
    this.loadingDetalle = true;
    let data = this.orderDetalle || [];
    this.searchesDetalle = [];
    this.columnsDetalle = [];
    data.map((key: string) => {
      let col: Column, search: Search;
      if (key === 'recid') {
        col = {
          field: key,
          text: key,
          size: '41px',
          frozen: false,
          sortable: true,
          hidden: true,
        };
      } else if (key === 'Rango') {
        col = {
          field: key,
          text: "<div style='text-align: center;'>Rango</div>",
          size: '100px',
          style: 'text-align: center;',
          sortable: true,
          attr: 'align=center',
        };
      } else if (
        key === '%1' ||
        key === '%2' ||
        key === '%3' ||
        key === '%4' ||
        key === '%5' ||
        key === '%6'
      ) {
        col = {
          field: key,
          text: "<div style='text-align: center;'>%</div>",
          size: '70px',
          style: 'text-align: center;',
          sortable: true,
          attr: 'align=center',
        };
      } else if (
        key === '#1' ||
        key === '#2' ||
        key === '#3' ||
        key === '#4' ||
        key === '#5' ||
        key === '#6'
      ) {
        col = {
          field: key,
          text: "<div style='text-align: center;'>#</div>",
          size: '70px',
          style: 'text-align: center;',
          sortable: true,
          attr: 'align=center',
        };
      } else if (key === 'Hide') {
        col = {
          field: key,
          text: key,
          size: '70px',
          sortable: true,
          hidden: true,
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
