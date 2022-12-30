import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Column, Show, Item, Record, Search, SelectType } from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
import { FallasFibraOpticaService } from 'src/app/services/fallas-fibra-optica/fallas-fibra-optica.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-popup-tabla',
  templateUrl: './popup-tabla.component.html',
  styleUrls: ['./popup-tabla.component.scss']
})
export class PopupTablaComponent implements OnInit {

  loading: boolean = false
  dataTabla: any = []
  header: string = 'Detalle De Tickets'
  name: string = 'DetalleTickets'
  show: Show = { toolbar: true, footer: true, header: false}
  items: Item
  updatedAt: string
  order: any;
  searches: Search[] = [];
  columns: Column[] = [];
  ticket: any;
  dialogTitle: string
  popupForm: FormGroup
  spinner = true

  constructor(
    public matDialogRef: MatDialogRef<PopupTablaComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private _pageService: HeaderService,
    private _fallasFOService: FallasFibraOpticaService,
  ) {
    this.ticket = data
    this.matDialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.openTable()
  }

  openTable(): void {
    this.dialogTitle = `Detalle ${this.ticket.rango} ${this.ticket.fecha}`
    this.getDataTabla(this.ticket)
  }

  getDataTabla(search: any) {
    this.loading = true
    this._fallasFOService.getDataDetalle(search).subscribe(({ data, message }: any) => {
      this.order = data.order;
      this.updatedAt = Date();
      this.dataTabla = this.orderKeys(data.data, data.order);
      this.format();
      this._pageService.openSnackBar(`success`, message);
      this.loading = false
      this.spinner = false
    }, (error) => {
      this._pageService.openSnackBar(`error`, error);
      this.loading = false
    });
  }

  sendForm(action: string): void {
		if (action === 'cancel') {
			this.matDialogRef.close({ type: action, data: undefined })
		} else {
			if (this.popupForm.status !== 'INVALID') {
				this.matDialogRef.close({ type: action, data: this.popupForm.getRawValue() })
			}
		}
	}

  format(): void {
    let data = this.order || [];
		this.searches = [];
		this.columns = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: true };
			} else if (key === "TICKET") {
				col = { field: key, text: key, size: "70px", sortable: true };
			} else if (key === "FALLA_MASIVA") {
				col = { field: key, text: key, size: "100px", sortable: true };
			} else if (key === "FECHA APERTURA") {
				col = { field: key, text: key, size: "130px", sortable: true };
			} else if (key === "FECHA CIERRE") {
				col = { field: key, text: key, size: "130px", sortable: true };
			} else if (key === "TIEMPO CLIENTE") {
				col = { field: key, text: key, size: "110px", sortable: true };
			} else if (key === "FLAG") {
				col = { field: key, text: key, size: "45px", sortable: true, hidden: true };
			} else if (key === "ESTADO_TICKET") {
				col = { field: key, text: key, size: "120px", sortable: true };
			} else if (key === "TT") {
				col = { field: key, text: 'TIEMPO TOTAL', size: "100px", sortable: true };
			} else {
				col = { field: key, text: key, size: "80px", sortable: true };
			}
			this.columns.push(col);
			if (key === "recid") {
				search = { field: key, label: key, type: 'int', hidden: true };
			} else {
				search = { field: key, label: key, type: 'text' };
			}
			this.searches.push(search);
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
