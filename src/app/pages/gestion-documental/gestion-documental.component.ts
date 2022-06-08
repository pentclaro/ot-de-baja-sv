import { Component, OnInit } from '@angular/core';
import { Column, Search, Show, Record } from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
import { GestionDocumentalService } from 'src/app/services/gestion-documental/gestion-documental.service';

@Component({
  selector: 'app-gestion-documental',
  templateUrl: './gestion-documental.component.html',
  styleUrls: ['./gestion-documental.component.scss']
})
export class GestionDocumentalComponent implements OnInit {
  public loading:boolean;
  public dataSourceResumen: any;
  public dataSourceDetalle: any;
  public headerResumen: string;
  public headerDetalle: string;
  public updatedAt: string;
	public order: any;
  public nameResumen: string;
  public nameDetalle: string;
  public show: Show;
	public columnsResumen: Column[] = [];
	public columnsDetalle: Column[] = [];
	public searchesResumen: Search[] = [];
	public searchesDetalle: Search[] = [];
  public datos: any;

  constructor(
    private _pageService: HeaderService,
    private _gestionDocumentalService: GestionDocumentalService
  ) { 
    this.loading = false;
    this.headerResumen = 'Gestión Documental';
    this.headerDetalle = 'Gestion Documental Detalle';
    this.nameResumen = 'gestionDocumentalResumen';
    this.nameDetalle = 'gestionDocumentalDetalle';
    this.show = { toolbar: true, footer: true, header: false };
  }

  ngOnInit(): void {
    this.obtenerGestionDocumentalResumen()
    this.obtenerGestionDocumentalDetalle()
  }

  obtenerGestionDocumentalResumen() {
    this.dataSourceResumen = [];
    this._gestionDocumentalService.obtenerGestionDocumentalResumen().subscribe(({ data, message }: any) => {
      this.order = data.order
      this.updatedAt = Date();
      this.dataSourceResumen = this.orderKeys(data.data, data.info);
      this.format();
      this.loading = true;
    },
    (error)=> {
				this._pageService.openSnackBar(`error`, error);
        this.loading = false;
      }
    )
  }

  obtenerGestionDocumentalDetalle() {
    this.dataSourceDetalle = [];
    this._gestionDocumentalService.obtenerGestionDocumentalDetalle().subscribe(({ data, message }: any) => {
      this.order = data.order
      this.updatedAt = Date();
      this.dataSourceDetalle = this.orderKeys(data.data, data.info);
      this.format2();
      this._pageService.openSnackBar(`success`, message);
      this.loading = false;
    },
    (error)=> {
				this._pageService.openSnackBar(`error`, error);
        this.loading = false;
      }
    )
  }

  format(): void {
		let data = this.order || [];
		this.searchesResumen = [];
		this.columnsResumen = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: false };
			} else if(key === "GRUPO_KM") {
        col = { field: key, text: key, size: "190px", frozen: false, sortable: true, hidden: false };
      } else {
				col = { field: key, text: key, size: "170px", sortable: true };
			}
			this.columnsResumen.push(col);
			if (key === "recid") {
				search = { field: key, label: key, type: 'int', hidden: true };
			} else {
				search = { field: key, label: key, type: 'text' };
			}
			this.searchesResumen.push(search);
		})
	}

  format2(): void {
		let data = this.order || [];
		this.searchesDetalle = [];
		this.columnsDetalle = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: false };
			} else {
				col = { field: key, text: key, size: "150px", sortable: true };
			}
			this.columnsDetalle.push(col);
			if (key === "recid") {
				search = { field: key, label: key, type: 'int', hidden: true };
			} else {
				search = { field: key, label: key, type: 'text' };
			}
			this.searchesDetalle.push(search);
		})
	}

  orderKeys(data: Record[], info: string[]): Record[] {
		let rowsArray = [];
		info = ["recid", ...info];
		if (Array.isArray(data)) {
			data.map(element => {
				let infoRow = {};
				info.map(key => {
					infoRow[key] = element[key];
				})
				rowsArray.push({
					...infoRow,
				});
			});
		}
		return rowsArray;
	}

}
