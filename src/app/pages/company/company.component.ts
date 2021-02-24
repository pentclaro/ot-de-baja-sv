import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FaultService } from 'src/app/services/fault/fault.service';
import { Columns, Item, Searches, Show, Toolbar } from 'src/app/interfaces/interfaces';
import { W2uiGridComponent } from 'src/app/components/w2ui-grid/w2ui-grid.component';
import { NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  filter: string;
  loading: boolean = false;
  countries: any[] = [];
  categories: any[] = [];
  search:{
    pais: string[],
    categoria: string,
    type: string,
    start: Date,
    end: Date
  } = {
    pais: [],
    categoria: "TODOS",
    type: null,
    start: null,
    end: null
  }
  name: string = 'demo';
  header: string = 'Demo w2ui';
  show: Show = { toolbar: true, footer: true, header: false };
  columns: Columns[] = [];
  searches: Searches[] = [];
  items: Item[] = [];
  toolbar: Toolbar = { items: this.items };
  sortData: any = [{ field: 'recid', direction: 'ASC' }];
  dataSource: any[] = [];
  updatedAt: Date;
  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild(W2uiGridComponent) w2ui: W2uiGridComponent;

  constructor(
    private faultService: FaultService,
    private pageService: HeaderService,
    public dialog: MatDialog,
    // private translate: TranslateService, 
    private dateAdapter: DateAdapter<Date>,
    public router: Router) { }

  ngOnInit() {
    this.getAllCountries();
    this.getAllCategories();
    this.dateAdapter.setLocale('es');
  }

  getAllCountries() {
    this.faultService.getCountry({}).subscribe((data: any) => {
      this.countries = data;
    }, (error: any) => {
      this.pageService.openSnackBar(`warning`, `Error al obtener los datos de Países, intenta de nuevo más tarde.`);
    });
  }

  getAllCategories() {
    this.faultService.getCategory({}).subscribe((data: any) => {
      this.categories = data;
    }, (error: any) => {
      this.pageService.openSnackBar(`warning`, `Error al obtener los datos de Categorías, intenta de nuevo más tarde.`);
    });
  }

  searchData(form): void {
    this.loading = true;
    this.form.form.markAllAsTouched();
    if (!this.form.form.invalid && this.search.pais.length > 0) {
      if (this.search.type === 'close') {
        this.findClose();
      } else if (this.search.type === 'open') {
        this.findOpen();
      }
    } else {
      this.pageService.openSnackBar(`warning`, `Error selecciona todos los campos.`);
      this.loading = false
    }
  }

  findClose(): void {
    this.faultService.getFaultClose(this.search).subscribe((data: any) => {
      this.dataSource = data;
      this.updatedAt = new Date();
      this.loading = false;
      this.pageService.openSnackBar(`success`, `Datos obtenidos de fallas cerradas`);
      this.format();
    }, (error: any) => {
      this.loading = false;
      this.pageService.openSnackBar(`warning`, `Error al obtener los datos de fallas cerradas, intenta de nuevo más tarde.`);
    });
  }

  findOpen(): void {
    this.faultService.getFaultOpen(this.search).subscribe((data: any) => {
      this.dataSource = data;
      this.updatedAt = new Date();
      this.loading = false;
      this.pageService.openSnackBar(`success`, `Datos obtenidos de fallas abiertas`);
      this.format();
    }, (error: any) => {
      this.loading = false;
      this.pageService.openSnackBar(`warning`, `Error al obtener los datos de fallas abiertas, intenta de nuevo más tarde.`);
    });
  }

  format(): void {
    let data = this.dataSource[0] || {};
    this.searches = [];
    this.columns = [];
    for (let key in data) {
      let col, fil;
      if (key == "recid") {
        col = { field: key, caption: "linea", size: "50px", frozen: true, sortable: true };
      }
      else if (key == "NUMERO") {
        col = { field: key, caption: key, size: "100px", frozen: true, sortable: true };
      }
      else {
        col = { field: key, caption: key, size: "100px", sortable: true };
      }
      if (key == "recid") {
        fil = { field: key, caption: "linea", type: 'int' };
      } else {
        fil = { field: key, caption: key, type: 'text' };
      }
      this.columns.push(col);
      this.searches.push(fil);
    }
  }

  refresh(event): void {
    if (event.tab.textLabel === "W2UI" && event.tab.isActive) {
      this.w2ui.refresh();
    }
  }

  selectAll() {
      this.search.pais = this.countries.map(x => x.title);
  }

  unselectAll() {
      this.search.pais = [];
  }

  printForm(form) {
    console.log(form)
  }

}
