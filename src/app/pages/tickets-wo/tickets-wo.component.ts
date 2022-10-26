import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Column, Search, Show, Record } from 'src/app/interfaces/interfaces';
import { HeaderService } from 'src/app/services/header.service';
import { FaultService } from 'src/app/services/fault/fault.service';
import { TicketsWOService } from 'src/app/services/tickets-wo/tickets-wo.service';

@Component({
  selector: 'app-tickets-wo',
  templateUrl: './tickets-wo.component.html',
  styleUrls: ['./tickets-wo.component.scss']
})
export class TicketsWOComponent implements OnInit {
  search: {mes: string[], pais: string[], area:string[], categoria:string[], codigo:string[]} = {mes: [], pais: [], area: [], categoria: [], codigo: []};
  loading: boolean = false;
  dataSourceDetalle: string[] = [];
  headerResumen: string = 'Tickets WO';
  headerDetalle: string = 'Tickets WO Detalle';
  updatedAt: string = '';
  order: any;
  nameResumen: string = 'ticketsWOResumen';
  nameDetalle: string = 'ticketsWODetalle';
  show: Show = { toolbar: true, footer: true, header: false };
  columnsResumen: Column[] = [];
  columnsDetalle: Column[] = [];
  searchesResumen: Search[] = [];
	searchesDetalle: Search[] = [];
  meses: string[] = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  paises: string[] = ['Todos', 'Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama'];
  areas: string[] = [];
  categorias: string[] = [];
  codigos: string[] = [];
  cleanChecks: boolean;
  filtroPais: string[];
  filtroCodigo: string[];
  dataSourceResumen: any[] = [];
  dataTablaDetalle: any[] = [];
  button: boolean = true
  i: number = 0;

  @ViewChild('form', { static: false}) form: NgForm;

  constructor(
    private _pageService: HeaderService,
    private _ticketsWOService: TicketsWOService,
    private _faultService: FaultService
  ) { }

  ngOnInit(): void {

  }

  inputOpen(input) {
    if (input === 'Area' && this.i === 0){
      this.i++
    } else if (input === 'Categoria' && this.i === 0){
      this.i++
    } else if (input === 'Area' && this.i === 1) {
      this.getComboCategoria(this.search.mes, this.search.area)
      this.i = 0
    } else {
      this.getComboCodigo(this.search.mes, this.search.area, this.search.categoria)
      this.i = 0
    }
  }

  selectedOpt(event, input): void {
    if(input === this.search.pais) {
      if (input[0] === 'Todos') {
        this.search.pais = this.paises
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.paises.length - 1) {
        this.search.pais = []
      }

      // this.filtroPais = []
      // this.search.pais.includes('Guatemala') ? this.filtroPais.push('GT'): '------'
      // this.search.pais.includes('El Salvador') ? this.filtroPais.push('SV'): '------'
      // this.search.pais.includes('Honduras') ? this.filtroPais.push('HN'): '------'
      // this.search.pais.includes('Nicaragua') ? this.filtroPais.push('NI') : '------'
      // this.search.pais.includes('Costa Rica') ? this.filtroPais.push('CR'): '------'
      // this.search.pais.includes('Panama') ? this.filtroPais.push('PA'): '------'
      // this.createComboArea(this.filtroPais)
      this.areas = []
      this.areas.unshift('Todos')
      this.getInfoAreas(this.search.pais)
      this.loading = false
    } else if (input === this.search.area){
      if (input[0] === 'Todos') {
        this.search.area = this.areas
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.areas.length - 1) {
        this.search.area = []
      }
      // this.search.area.length > 0 ? this.getComboCategoria(this.search.mes, this.search.area) : ''
    } else if (input === this.search.categoria) {
      if (input[0] === 'Todos') {
        this.search.categoria = this.categorias
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.categorias.length - 1) {
        this.search.categoria = []
      }
      // this.search.categoria.length > 0 ? this.getComboCodigo(this.search.mes, this.search.area, this.search.categoria) : ''
    } else if (input === this.search.codigo) {
      if (input[0] === 'Todos') {
        this.search.codigo = this.codigos
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.codigos.length - 1) {
        this.search.codigo = []
      }
      this.button = false
    }

  }

  getInfoAreas(pais) {
    let areasArray = []
    const GT = ['WO - CC_PLANTA EXTERNA_GT' ,'WO - ING OPTIMIZACION_GT' ,'WO - PLANTA EXTERNA GT' ,'WO - NOC GT' ,'WO - OPERACIONES CENTRAL GT'
      ,'WO - OPERACIONES OCCIDENTE GT' ,'WO - ING RED_GT' ,'WO - B.O CORE GT' ,'WO - DESPACHO_GT' ,'WO - COMERCIAL_GT' ,'WO - LOGISTICA GT'
      ,'WO - VOC GT' ,'WO - ING MOVIL IMPLEMENTACION_GT' ,'WO - OPERACIONES DATOS METRO GT' ,'WO - ING SVA_GT' ,'WO - INGENIERIA IP_GT' ,'WO - N1_GT'
      ,'WO - B.O ACCESO GT' ,'WO - B.O CONMUTACION GT' ,'WO - INGENIERIA CLIENTES_GT' ,'WO - BACK OFFICE TX_GT' ,'WO - BACK  OFFICE IP_Tx GT'
      ,'WO - B.O CLARO_XT GT', 'WO - GT - B.O HEADEND' ,'WO - B.O SVA GT' ,'WO - CCR GT' ,'WO - BO_ITS_SEGURIDAD_GT' ,'WO - B.O SEGURIDAD IP_GT'
      ,'WO - CNOC_GT' ,'WO - OPERACIONES ORIENTE GT' ,'WO - CONMUTACION METRO GT' ,'WO - BACK OFFICE IP_GT' ,'WO - CC_METRO_GT' ,'WO - ING CORE_GT'
      ,'WO - FRONT OFFICE' ,'WO - B.O CONMUTACION REG' ,'WO - SVA_XT' ,'WO - ING OPTIMIZACION' ,'WO - CONF CNOC_REG' ,'WO - PLANTA_EX_XT' ,'WO - B.O TX REG'
      ,'WO - REPUESTOS' ,'WO - CNOC SOC' ,'WO - INGENIERIA' ,'WO - B.O IP REG' ,'WO - SEG_CONTROL_XT' ,'WO - CNOC _ WIMAX']
    const SV = ['WO - PLANTA_EXTERNA_SV' ,'WO - INSTALACIONES_SV' ,'WO - FIBRA OPTICA_SV' ,'WO - B.O ROAMING_SV' ,'WO - CCR SV' ,'WO - GESTION_DATOS_SV'
      ,'WO - B.O MASTER HEADEND_SV' ,'WO - N1 SV' ,'WO - B.O CORE_SV' ,'WO - F.O VOC_SV' ,'WO - PI VIDEOHUB_SV' ,'WO - B.O CENTGEST CXINT ERICSSON_SV'
      ,'WO - INGENIERIA_CLIENTE_SV' ,'WO - PX TRONCALES ORIENTE_SV' ,'WO - B.O GESTION TX_SV' ,'WO - B.O ACCESO SV' ,'WO - PX TRONCALES CENTRO_SV'
      ,'WO - ING_ACCESO_IP_TV_SV' ,'WO - PX TRONCALES OCCIDENTE_SV' ,'WO - DESPACHO_CC_SV' ,'WO - B.O GESTION DX_SV' ,'WO - B.O CONMUTACION REG'
      ,'WO - B.O TX REG' ,'WO - REPUESTOS' ,'WO - CNOC SOC' ,'WO - B.O IP REG']
    const HN = ['WO - B.O DATOS HN' ,'WO - CCR HN' ,'WO - ING OPTIMIZACION_HN' ,'WO - HUB_SATELITAL_HN' ,'WO - ING TRANSMISION_HN' ,'WO - PLANTA EXTERNA_HN'
      ,'WO - B.O CONMUTACION REG' ,'WO - B.O TX REG' ,'WO - REPUESTOS' ,'WO - CNOC SOC' ,'WO - INGENIERIA' ,'WO - CARSO' ,'WO - B.O IP REG' ,'WO - SEG_CONTROL_XT']
    const NI = ['WO - B.O TRANSMISION NI' ,'WO - B.O MOVIL NI' ,'WO - ING VAS_NI' ,'WO - ING IP RED CLIENTE_NI' ,'WO - INGENIERIA IP RED_NI' ,'WO - B.O DATOS NI'
      ,'WO - ADMINISTRACION SITIOS NI' ,'WO - CCR NI' ,'WO - B.O CONMUTACION NI' ,'WO - PLANTA EXTERNA NI' ,'WO - ING OPTIMIZACION_NI', 'WO - CNOC_NICARAGUA'
      ,'WO - B.O CONMUTACION REG', 'WO - ADMINISTRACION TEMIP', 'WO - B.O TX REG', 'WO - REPUESTOS', 'WO - CNOC SOC', 'WO - B.O IP REG', 'WO - SEG_CONTROL_XT']
    const CR = ['WO - CCR CR', 'WO - ING OPTIMIZACION CR', 'WO - LOGISTICA CR', 'WO - ING TRANSMISION IP_CR', 'WO - FRONT OFFICE', 'WO - B.O CONMUTACION REG'
      , 'WO - ADMINISTRACION SM', 'WO - ING OPTIMIZACION', 'WO - B.O TX REG', 'WO - REPUESTOS', 'WO - CNOC SOC', 'WO - B.O IP REG']
    const PA = ['WO - CCR PA', 'WO - ING_TX_IP_PA', 'WO - PLANTA_EXTERNA_PA', 'WO - B.O TX REG']

    if (this.search.pais.includes('Todos')) {
      GT.map(area => this.areas.push(area))
      SV.map(area => this.areas.push(area))
      HN.map(area => this.areas.push(area))
      NI.map(area => this.areas.push(area))
      CR.map(area => this.areas.push(area))
      PA.map(area => this.areas.push(area))
    }
    if (this.search.pais.includes('Guatemala')) {
      GT.map(area => areasArray.push(area))
    }
    if (this.search.pais.includes('El Salvador')) {
      SV.map(area => areasArray.push(area))
    }
    if (this.search.pais.includes('Honduras')) {
      HN.map(area => areasArray.push(area))
    }
    if (this.search.pais.includes('Nicaragua')) {
      NI.map(area => areasArray.push(area))
    }
    if (this.search.pais.includes('Costa Rica')) {
      CR.map(area => areasArray.push(area))
    }
    if (this.search.pais.includes('Panama')) {
      PA.map(area => areasArray.push(area))
    }

    areasArray.map(item => this.filtrarAreas(item))
    // this._faultService.getAreas().subscribe((data: any) => {
    //   let response = data
    //   console.log(data)
    //   response.map(item => {
    //     this.areas.push(item.ASSIGN_DEPT)
    //   })

    // }, (error: any) => {
    //   this._pageService.openSnackBar(`warning`, `Error al obtener las áreas, intenta de nuevo más tarde.`);
    // })
  }

  filtrarAreas(area) {
    if(!this.areas.includes(area)) {
      this.areas.push(area)
    }
  }

  filtrarCodigos(codigo) {
    if(!this.codigos.includes(codigo)) {
      this.codigos.push(codigo)
    }
  }

  createComboArea(paises: string[]) {
    this.loading = true
    this.areas = []
    this.categorias = []
    this.codigos = []
    this.filtroPais.map(item => {
      this.getInfoAreas(item)
    })
    this.areas.unshift('Todos')
  }

  getComboCategoria(mes, area) {
    this.categorias = []
    this.codigos = []
    this._faultService.getCategorias(mes, area).subscribe((data: any) => {
      let response = data
      if (data.length === 0) {
      this._pageService.openSnackBar(`warning`, `No contamos con categorías del área seleccionada, elige otra área por favor`);
      } else {
        response.map(item => this.categorias.push(item.CATEGORIA_CIERRE))
        this.categorias.length === 1 ? '' : this.categorias.unshift('Todos')
      }
    }, (error: any ) => {
      this._pageService.openSnackBar(`warning`, `Error al obtener las categorías, intenta de nuevo más tarde.`);
    })
  }

  getComboCodigo(mes, area, categoria) {
    this.codigos = []
    this._faultService.getCodigos(mes, area, categoria).subscribe((data: any) => {
      let response = data
      if (data.length === 0) {
        this._pageService.openSnackBar(`warning`, `No contamos con códigos de la categoría seleccionada, elige otra categoría por favor`);
      } else {
        response.map(item => this.filtrarCodigos(item.CODIGO_CIERRE))
        this.codigos.length === 1 ? '' : this.codigos.unshift('Todos')
      }
      this.loading = false
    }, (error: any ) => {
      this._pageService.openSnackBar(`warning`, `Error al obtener los códigos, intenta de nuevo más tarde.`);
    })
  }

  searchData(form): void {
    this.loading = true;
		this.form.form.markAllAsTouched();
		if (this.form.valid) {
      this.dataSourceResumen = [];
      this.dataTablaDetalle = []
      this.getTablaResumen(this.filtroPais, this.search);
      this.getTablaDetalle(this.filtroPais, this.search);
      this.loading = false
		} else {
      this._pageService.openSnackBar(`warning`, `Error selecciona todos los campos.`);
			this.loading = false
		}
  }

  getTablaResumen(pais, search) {
    this._ticketsWOService.getDataTablaResumen(pais, search).subscribe(({ data, message}: any) => {
      this.order = data.order
      this.updatedAt = Date();
      this.dataSourceResumen = this.orderKeys(data.data, data.info);
      this.formatResumen();
    },
    (error) => {
      this._pageService.openSnackBar(`error`, error);
      this.loading = false;
    })
  }

  getTablaDetalle(pais, search) {
    this._ticketsWOService.getDataTablaDetalle(pais, search).subscribe(({ data, message}: any) => {
      this.order = data.order
      this.updatedAt = Date();
      this.dataTablaDetalle = this.orderKeys(data.data, data.info);
      this.formatDetalle();
    },
    (error) => {
      this._pageService.openSnackBar(`error`, error);
      this.loading = false;
    })
  }

  formatResumen(): void {
    let data = this.order || [];
		this.searchesResumen = [];
		this.columnsResumen = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: true };
			} else if(key === "AREA"){
				col = { field: key, text: key, size: "170px", sortable: true };
			} else if(key === "CATEGORIA_CIERRE"){
				col = { field: key, text: key, size: "130px", sortable: true };
			} else if(key === "CODIGO_CIERRE"){
				col = { field: key, text: key, size: "180px", sortable: true };
			} else if(key === "PAIS"){
				col = { field: key, text: key, size: "45px", sortable: true };
			} else if(key === "TOTAL"){
				col = { field: key, text: key, size: "50px", sortable: true };
			} else {
				col = { field: key, text: key, size: "80px", sortable: true };
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

  formatDetalle(): void {
    let data = this.order || [];
		this.searchesDetalle = [];
		this.columnsDetalle = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: false };
      } else if(key === "TICKET") {
				col = { field: key, text: key, size: "80px", sortable: true };
      } else if(key === "AREA") {
				col = { field: key, text: key, size: "170px", sortable: true };
      } else if(key === "CATEGORIA DE CIERRE") {
				col = { field: key, text: key, size: "180px", sortable: true };
      } else if(key === "CODIGO DE CIERRE") {
				col = { field: key, text: key, size: "130px", sortable: true };
      } else if(key === "FECHA") {
				col = { field: key, text: key, size: "110px", sortable: true };
      } else {
				col = { field: key, text: key, size: "110px", sortable: true };
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
