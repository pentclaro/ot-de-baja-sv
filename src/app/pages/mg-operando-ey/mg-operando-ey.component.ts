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
  tiposAlarma: string[] = ['MG OPERANDO', 'Corte de Energía Comercial'];
  afectaciones: string[] = ['Ambas', 'CON AFECTACION', 'SIN AFECTACION'];
  regiones: string[] = [];
  search: {
    pais: string;
    region: string[];
    tipoAlarma: string;
    afectacion: string;
    dateRange: { start: Date; end: Date };
  } = {
    pais: '',
    region: [],
    tipoAlarma: '',
    afectacion: 'Ambas',
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
    // this.tituloReporte = 'MG Operando'; // Cambiamos el título de las primeras partes del reporte sino es Metro Sur
    if (input === this.search.pais) {
      this.search.region = [];
      this.regiones = [];
      // FRAGMENTO ESPECIFICO DEL FILTRO DE PAIS
      if (this.search.pais !== 'Regional') {
        this.loadingDetalle = true;
        this.getDataRegiones(this.search.pais);
        // this.loadingDetalle = false;
      }
      //  else {
      //   this.search.region = [];
      //   this.regiones = [];
      // }
    } else {
      if (this.areAllRegionsSelected) {
        this.search.region = [];
        this.areAllRegionsSelected = false;
      } else {
        if (input.includes('TODAS')) {
          // console.log('regiones todas', this.regiones);
          this.search.region = this.regiones;
          this.areAllRegionsSelected = true;
        }
      }
    }
  }

  /* MÉTODO QUE SE EJECUTA CUANDO SE LE DA CLIC AL BOTÓN DE BUSCAR */
  searchData(form): void {
    if (!this.search.dateRange.start || !this.search.dateRange.end) {
      this._pageService.openSnackBar(
        `warning`,
        `Error selecciona todos los campos.`
      );
      return;
    }
    // this.loading = true;
    // this.loadingDetalle = true;
    this.form.form.markAllAsTouched();
    if (this.form.valid) {
      this.tituloReporte = this.search.tipoAlarma;
      // this.loadingDetalle = true;
      this.updatedAt = Date();
      this.reporteCargado = true;
      this.getTableDetalle(this.search);
    } else {
      this._pageService.openSnackBar(
        `warning`,
        `Error selecciona todos los campos.`
      );
      this.reporteCargado = false;
      this.loadingDetalle = false;
      this.loading = false;
    }
  }

  /* MÉTODO QUE CARGA E INSERTA DENTRO DEL INPUT DE REGIONES AL SELECCIONAR UN PAÍS */
  getDataRegiones(pais: string) {
    this.loading = true;
    this.regiones = [];
    this._faultMgOperando.getDataRegiones(pais).subscribe(
      (data: any) => {
        data.map((region) => {
          // this.regiones.push(region.TG_TIPO_SITIO);
          this.regiones.push(region.REGION);
        });
        this.regiones.unshift('TODAS');
        this.loading = false;
        this.loadingDetalle = false;
      },
      (error) => {
        this.loading = false;
        this.loadingDetalle = false;

        // console.log('error regiones');
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
    // this.orderDetalle = [];
    // this.searchesDetalle = [];
    // this.columnsDetalle = [];
    // this.dataSourceDetalle = [];

    this.loadingDetalle = true;
    this.loading = true;

    // console.log('alarm', search.tipoAlarma);
    // return;
    if (search.tipoAlarma === 'MG OPERANDO') {
      this._mgOperandoEyService.getMgOperando(search).subscribe(
        ({ data, message }: any) => {
          this.orderDetalle = data.order;
          let datos = data.data;
          this.updatedAt = Date();
          this.dataSourceDetalle = this.orderKeys(datos, data.info);
          this.format();

          // let fechas = [];
          // let cantidades = [];
          // let promedios = [];
          this.loading = false;
        },
        (error) => {
          this._pageService.openSnackBar('error', error);
          this.loading = false;
          this.loadingDetalle = false;
        }
      );
    } else {
      this._mgOperandoEyService.getCorteEnergia(search).subscribe(
        ({ data, message }: any) => {
          this.orderDetalle = data.order;
          let datos = data.data;
          this.updatedAt = Date();
          this.dataSourceDetalle = this.orderKeys(datos, data.info);
          this.format();

          // let fechas = [];
          // let cantidades = [];
          // let promedios = [];
          this.loading = false;
          this.loadingDetalle = false;
        },
        (error) => {
          this._pageService.openSnackBar('error', error);
          this.loading = false;
          this.loadingDetalle = false;
        }
      );
    }
  }

  format(): void {
    this.loadingDetalle = true;
    let data = this.orderDetalle || [];
    this.searchesDetalle = [];
    this.columnsDetalle = [];
    // console.log('keys', data);
    data.map((key: string) => {
      let col: Column, search: Search;
      if (key === 'recid') {
        col = {
          field: key,
          text: key,
          size: '1px',
          frozen: false,
          sortable: true,
          hidden: true,
        };
      } else if (key === 'ORIGINAL_EVENT_TIME') {
        col = {
          field: key,
          text: key,
          size: '180px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'SITIO') {
        col = {
          field: key,
          text: key,
          size: '200px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'MANAGED_OBJECT') {
        col = {
          field: key,
          text: key,
          size: '300px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'EVENT_TIME') {
        col = {
          field: key,
          text: key,
          size: '200px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'CREATION_TIMESTAMP') {
        col = {
          field: key,
          text: key,
          size: '180px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (
        key === 'TERMINATION_TIME_STAMP' ||
        key === 'TRMT_TIME_STAMP'
      ) {
        col = {
          field: key,
          text: key,
          size: '180px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'DOCUMENTO_REFERENCIA') {
        col = {
          field: key,
          text: key,
          size: '200px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'OC_NAME') {
        col = {
          field: key,
          text: key,
          size: '150px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'ALARM_OBJECT_OPERATOR_NOTE') {
        col = {
          field: key,
          text: key,
          size: '200px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'ADDITIONAL_TEXT') {
        col = {
          field: key,
          text: key,
          size: '300px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'REGION') {
        col = {
          field: key,
          text: key,
          size: '150px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      } else if (key === 'AFECTACION') {
        col = {
          field: key,
          text: key,
          size: '130px',
          // style: '',
          sortable: true,
          // attr: 'align=center',
        };
      }
      // else if (
      //   key === '%1' ||
      //   key === '%2' ||
      //   key === '%3' ||
      //   key === '%4' ||
      //   key === '%5' ||
      //   key === '%6'
      // ) {
      //   col = {
      //     field: key,
      //     text: "<div style='text-align: center;'>%</div>",
      //     size: '70px',
      //     style: 'text-align: center;',
      //     sortable: true,
      //     attr: 'align=center',
      //   };
      // }
      //  else if (
      //   key === '#1' ||
      //   key === '#2' ||
      //   key === '#3' ||
      //   key === '#4' ||
      //   key === '#5' ||
      //   key === '#6'
      // ) {
      //   col = {
      //     field: key,
      //     text: "<div style='text-align: center;'>#</div>",
      //     size: '70px',
      //     style: 'text-align: center;',
      //     sortable: true,
      //     attr: 'align=center',
      //   };
      // }
      // else if (key === 'Hide') {
      //   col = {
      //     field: key,
      //     text: key,
      //     size: '70px',
      //     sortable: true,
      //     hidden: true,
      //   };
      // }
      else {
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
