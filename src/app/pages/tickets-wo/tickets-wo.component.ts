import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class TicketsWOComponent implements AfterViewInit {
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
  paises: any[] = [];
  areas: any[] = [];
  categorias: any[] = [];
  codigos: any[] = [];
  cleanChecks: boolean;
  filtroPais: string[];
  filtroArea: any[] = []
  filtroPaisBK: string[];
  filtroAreasBK: string[] = []
  filtroCategoriasBK: string[] = []
  dataSourceResumen: any[] = [];
  dataTablaDetalle: any[] = [];
  button: boolean = true
  i: number = 0;
  sumaTicketsConReclamo: number
  totalTickets: number
  porcentajeConReclamos: any
  loadingDetalle: boolean = false
  dataInputs: any = []
  dataFiltroPais : any = []
  dataFiltroArea : any = []
  dataFiltroCategoria: any = []
  filtroCodigosBK: any[];
  dataFiltroCodigo: any[];
  datosMes: any;
  datosMesResumen: any;
  datosPais: any;
  datosArea: any;
  datosCategoria: any;
  datosCodigo: any;
  datosResumen: any;
  columnasResumen: any
  columnasDetalle: string[];
  datosPaisResumen: any[];
  datosConteo: any;
  datosAreaResumen: any[];
  datosCategoriaResumen: any[];
  datosCodigoResumen: any[];

  @ViewChild('form', { static: false}) form: NgForm;

  constructor(
    private _pageService: HeaderService,
    private _ticketsWOService: TicketsWOService,
    private _faultService: FaultService,
  ) { }

  ngAfterViewInit(): void {
  }

  selectedOpt(event, input): void {
    if (input === this.search.mes) {
      this.dataSourceResumen = []
      this.dataTablaDetalle = []
      this.getDataInputs(this.search.mes)
      this.getDataConteo(this.search.mes)
    } else if(input === this.search.pais) {
      this.datosPaisResumen = []
      if (input[0] === 'TODOS') {
        this.search.pais = this.filtroPaisBK
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.paises.length - 1) {
        this.search.pais = []
      }
      if(input.length === 0) {
        this.getTablaResumen(this.convertirDatosResumen(this.datosConteo), this.columnasResumen)
        this.areas = []
        this.categorias = []
        this.codigos = []
      }
      this.getInputAreas(this.search.pais)
      this.datosPaisResumen = this.search.pais.length !== 0 ? this.convertirDatosResumen(this.filtrarDatosResumen(this.search.pais, this.datosConteo, 'PAIS')) : null
      !!this.datosPaisResumen ? this.getTablaResumen(this.datosPaisResumen, this.columnasResumen) : ''
      this.loading = false
    } else if (input === this.search.area){
      this.datosAreaResumen = []
      if (input[0] === 'TODOS') {
        this.search.area = this.filtroAreasBK
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.areas.length - 1) {
        this.search.area = []
      }
      if(input.length === 0) {
        this.getTablaResumen(this.convertirDatosResumen(this.datosPaisResumen), this.columnasResumen)
        this.categorias = []
        this.codigos = []
      }
      this.getInputCategorias(this.search.area)
      this.datosAreaResumen = this.search.area.length !== 0 ? this.convertirDatosResumen(this.filtrarDatosResumen(this.search.area, this.datosPaisResumen, 'AREA')) : null
      !!this.datosAreaResumen ? this.getTablaResumen(this.datosAreaResumen, this.columnasResumen) : ''
    } else if (input === this.search.categoria) {
      this.datosCategoriaResumen = []
      if (input[0] === 'TODOS') {
        this.search.categoria = this.filtroCategoriasBK
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.categorias.length - 1) {
        this.search.categoria = []
      }
      if (input.length === 0) {
        this.getTablaResumen(this.convertirDatosResumen(this.datosAreaResumen), this.columnasResumen)
        this.codigos = []
      }
      this.getInputCodigos(this.search.categoria)
      this.datosCategoriaResumen = this.search.categoria.length !== 0 ? this.convertirDatosResumen(this.filtrarDatosResumen(this.search.categoria, this.datosAreaResumen, 'CATEGORIA_CIERRE')) : null
      !!this.datosCategoriaResumen ? this.getTablaResumen(this.datosCategoriaResumen, this.columnasResumen) : ''
    } else if (input === this.search.codigo) {
      this.datosCodigoResumen = []
      if (input[0] === 'TODOS') {
        this.search.codigo = this.filtroCodigosBK
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.codigos.length - 1) {
        this.search.codigo = []
      }
      if (input.length === 0) {
        this.getTablaResumen(this.convertirDatosResumen(this.datosCategoriaResumen), this.columnasResumen)
      }
      this.button = false
      this.getDataCodigos(this.dataFiltroCodigo)
      this.datosCodigoResumen = this.search.codigo.length !== 0 ? this.convertirDatosResumen(this.filtrarDatosResumen(this.search.codigo, this.datosCategoriaResumen, 'CODIGO_CIERRE')) : null
      !!this.datosCodigoResumen ? this.getTablaResumen(this.datosCodigoResumen, this.columnasResumen) : ''
    }
  }

  getDataInputs(mes) {
    this.loadingDetalle = true
    this._faultService.getInfoInputs(mes).subscribe((data) => {
      this.dataInputs = data
      this.datosMes = []
      let i = 1
      this.dataInputs.map(obj => {
        const NewObj = { recid: i, ...obj }
        i++
        this.datosMes.push(NewObj)
      })
      this.columnasDetalle = Object.keys(this.datosMes[0])
      this.getInputPaises(data)
      this.getTablaDetalle(this.datosMes, this.columnasDetalle)
      this.getDataDetalleTotal(this.dataInputs)
      this.loadingDetalle = false
    }, (error) => {

    })
  }

  getDataConteo(mes) {
    this._ticketsWOService.getDataTablaResumen(mes).subscribe(({ data, message}: any) => {
      this.datosConteo = data.data
      this.columnasResumen = data.info
      this.updatedAt = Date();
      this.datosMesResumen = []
      this.getTablaResumen(this.convertirDatosResumen(this.datosConteo), this.columnasResumen);
    },
    (error) => {
      this._pageService.openSnackBar(`error`, error);
      this.loading = false;
    })
  }

  getInputPaises(data):void {
    this.dataFiltroPais = []
    this.filtroPaisBK = []
    this.paises = []
    this.filtroPais = []
    let tickets = []
    this.datosPais = []
    const paises = this.eliminarDuplicados(data, item => item.PAIS)
    paises.map(pais => this.filtroPais.push(pais.PAIS))
    this.filtroPais.map(pais => {
      let cantidad = data.filter(ticket => ticket.PAIS === pais)
      this.dataFiltroPais.push(cantidad)
      tickets.push(cantidad.length)
    })
    this.dataFiltroPais.map(pais => pais.map(item => this.datosPais.push(item))) //Datos pais
    let i = 0
    this.filtroPais.map(pais => {
      this.paises.push({Pais: pais, Cantidad: tickets[i]})
      i++
    })
    if(tickets) {
      const totalTickets = tickets.reduce((prev, curr) => prev + curr)
      this.paises.unshift({Pais: 'TODOS', Cantidad: totalTickets})
      this.paises.map(pais => this.filtroPaisBK.push(pais.Pais))
    }
  }

  getInputAreas(paises):void {
    this.dataFiltroArea = []
    this.filtroArea = []
    this.filtroAreasBK = []
    this.areas = []
    let tickets = []
    let filtradoPais = []
    let areas = []
    let filtroAreas = []
    this.datosPais = []
    paises.map(pais => {
      this.dataFiltroPais.map(ticket => {
        const filtroPais = ticket.filter(item => item.PAIS === pais)
        areas.push(filtroPais)
      })
    })
    /* LLENADO DE COMBOS E INFO PARA TABLA DETALLE*/
    areas.map(item => item.length !== 0 ? filtradoPais.push(item): '')
    filtradoPais.map(ticket => {
      ticket.map(item => this.dataFiltroArea.push(item)) // data filtrada areas
    })
    let j = 1
    this.dataFiltroArea.map(obj => {
      const NewObj = { recid: j, ...obj }
      j++
      this.datosPais.push(NewObj)
    })
    if(this.dataFiltroArea.length === 0) {
      this.getTablaDetalle(this.datosMes, this.columnasDetalle)
    } else {
      this.getTablaDetalle(this.datosPais, this.columnasDetalle)
    }
    const areaFiltrada = this.eliminarDuplicados(this.dataFiltroArea, item => item.AREA)
    areaFiltrada.map(pais => {
      filtroAreas.push(pais.AREA)
    })
    filtroAreas.map(item => this.filtroArea.push(item))
    filtroAreas = []
    this.filtroArea.map(area => {
      let cantidad = this.dataFiltroArea.filter(ticket => ticket.AREA === area)
      filtroAreas.push(cantidad)
      tickets.push(cantidad.length)
    })
    let i = 0
    this.filtroArea.map(area => {
      this.areas.push({Area: area, Cantidad: tickets[i]})
      i++
    })
    if (tickets) {
      const totalTickets = tickets.reduce((prev, curr) => prev + curr)
      this.areas.unshift({Area: 'TODOS', Cantidad: totalTickets})
      this.areas.map(item =>  this.filtroAreasBK.push(item.Area))
    }
  }

  getInputCategorias(areas):void {
    this.filtroCategoriasBK = []
    this.dataFiltroCategoria = []
    this.categorias = []
    let tickets = []
    let categorias = []
    let filtroCategorias = []
    let filtradoAreas = []
    this.datosArea = []
    areas.map(area => {
      let categoria = this.dataFiltroArea.filter(item => item.AREA === area)
      categorias.push(categoria)
    })
    categorias.map(categoria => {
      categoria.map(item => this.dataFiltroCategoria.push(item))
    })
    let j = 1
    this.dataFiltroCategoria.map(obj => {
      const NewObj = { recid: j, ...obj }
      j++
      this.datosArea.push(NewObj)
    })
    if(this.dataFiltroCategoria.length === 0) {
      this.getTablaDetalle(this.datosPais, this.columnasDetalle)
    } else if (this.dataFiltroArea.length === 0) {
      this.getTablaDetalle(this.datosMes, this.columnasDetalle)
    } else {
      this.getTablaDetalle(this.datosArea, this.columnasDetalle)
    }
    categorias = this.dataFiltroCategoria
    const categoriasFiltradas = this.eliminarDuplicados(categorias, item => item['CATEGORIA DE CIERRE'])
    categoriasFiltradas.map(categoria => this.filtroCategoriasBK.push(categoria['CATEGORIA DE CIERRE']))
    this.filtroCategoriasBK.map(categoria => {
      let cantidad = this.dataFiltroCategoria.filter(ticket => ticket['CATEGORIA DE CIERRE'] === categoria)
      filtroCategorias.push(cantidad)
      tickets.push(cantidad.length)
    })
    filtroCategorias.map(categoria => {
      categoria.map(item => filtradoAreas.push(item))
    })
    let i = 0
    this.filtroCategoriasBK.map(categoria => {
      this.categorias.push({Categoria: categoria, Cantidad: tickets[i]})
      i++
    })
    if (tickets) {
      const totalTickets = tickets.reduce((prev, curr) => prev + curr)
      this.categorias.unshift({Categoria: 'TODOS', Cantidad: totalTickets})
      this.categorias.map(item => this.filtroCategoriasBK.push(item.Categoria))
    }
    this.dataFiltroCategoria = filtradoAreas //dataAreas
  }

  getInputCodigos(categorias): void {
    this.filtroCodigosBK = []
    this.dataFiltroCodigo = []
    this.codigos = []
    let tickets = []
    let codigos = []
    let filtroCodigos = []
    let filtradoCategorias = []
    this.datosCategoria = []
    categorias.map(categoria => {
      let codigo = this.dataFiltroCategoria.filter(item => item['CATEGORIA DE CIERRE'] === categoria)
      codigos.push(codigo)
    })
    codigos.map(codigo => codigo.map(item => this.dataFiltroCodigo.push(item)))
    categorias = this.dataFiltroCodigo
    this.dataFiltroCodigo = this.eliminarDuplicados(this.dataFiltroCodigo, item => item)
    let j = 1
    this.dataFiltroCodigo.map(obj => {
      const NewObj = { recid: j, ...obj }
      j++
      this.datosCategoria.push(NewObj)
    })
    if(this.dataFiltroCodigo.length === 0) {
      this.getTablaDetalle(this.datosArea, this.columnasDetalle)
    } else if(this.dataFiltroCategoria.length === 0) {
      this.getTablaDetalle(this.datosPais, this.columnasDetalle)
    } else if (this.dataFiltroArea.length === 0) {
      this.getTablaDetalle(this.datosMes, this.columnasDetalle)
    } else {
      this.getTablaDetalle(this.datosCategoria, this.columnasDetalle)
    }
    const codigosFiltrados = this.eliminarDuplicados(categorias, item => item['CODIGO DE CIERRE'])
    codigosFiltrados.map(codigo => this.filtroCodigosBK.push(codigo['CODIGO DE CIERRE']))
    this.filtroCodigosBK.map(codigo => {
      let cantidad = this.dataFiltroCodigo.filter(ticket => ticket['CODIGO DE CIERRE'] === codigo)
      filtroCodigos.push(cantidad)
      tickets.push(cantidad.length)
    })
    filtroCodigos.map(codigo => {
      codigo.map(item => filtradoCategorias.push(item))
    })
    let i = 0
    this.filtroCodigosBK.map(codigo => {
      this.codigos.push({Codigo: codigo, Cantidad: tickets[i]})
      i++
    })
    if (tickets) {
      const totalTickets = tickets.reduce((prev, curr) => prev + curr)
      this.codigos.unshift({Codigo: 'TODOS', Cantidad: totalTickets})
      this.codigos.map(item => this.filtroCodigosBK.push(item.Codigo))
    }
    this.dataFiltroCodigo = filtradoCategorias // dataCategorias
  }

  getDataCodigos(data) {
    this.datosCodigo = []
    let datos = []
    let datosCodigo = []
    const opciones = this.eliminarDuplicados(this.search.codigo, item => item)
    opciones.map(opcion => {
      const datosFiltrados = data.filter(ticket => ticket['CODIGO DE CIERRE'] === opcion)
      datosCodigo.push(datosFiltrados)
    })
    datosCodigo.map(ticket => ticket.map(item => datos.push(item)))
    let j = 1
    datos.map(obj => {
      const NewObj = { recid: j, ...obj }
      j++
      this.datosCodigo.push(NewObj)
    })
    if (datos.length === 0) {
      this.getTablaDetalle(this.datosCategoria, this.columnasDetalle)
    } else if(this.dataFiltroCodigo.length === 0) {
      this.getTablaDetalle(this.datosArea, this.columnasDetalle)
    } else if(this.dataFiltroCategoria.length === 0) {
      this.getTablaDetalle(this.datosPais, this.columnasDetalle)
    } else if (this.dataFiltroArea.length === 0) {
      this.getTablaDetalle(this.datosMes, this.columnasDetalle)
    } else {
      this.getTablaDetalle(this.datosCodigo, this.columnasDetalle)
    }
  }

  getTablaResumen(data, columnas) {
    this.updatedAt = Date()
    columnas = ['recid', ...columnas]
    this.order = columnas
    this.dataSourceResumen = this.orderKeys(data, columnas)
    this.formatResumen()
    this.loadingDetalle = false
  }

  getDataDetalleTotal(data) {
    this.loadingDetalle = true
    let datosCodigos = []
    this.datosResumen = []
    let sumaCodigos = 0
    let codigos = []
    let cantidadesCodigos = []
    let i = 0
    const categoria = data.filter(item => item['CATEGORIA DE CIERRE'] === 'FALLA DE GESTION')
    const codigosFiltrados = this.eliminarDuplicados(categoria, item => item['CODIGO DE CIERRE'])
    codigosFiltrados.map(item => codigos.push(item['CODIGO DE CIERRE']))
    codigos.sort()
    codigos.map(codigo => {
      const filtroCodigo = categoria.filter(item => item['CODIGO DE CIERRE'] === codigo)
      datosCodigos.push(filtroCodigo)
    })
    datosCodigos.map(item => cantidadesCodigos.push(item.length))
    cantidadesCodigos.map(item => {
      this.datosResumen.push({CODIGO_CIERRE: codigos[i], CONTEO_COD_CIERRE: item})
      i++
    })
    this.datosResumen.map(item => {
      sumaCodigos += item.CONTEO_COD_CIERRE
    })
    const newObj = {CODIGO_CIERRE: 'TOTAL GENERAL', CONTEO_COD_CIERRE: sumaCodigos}
    this.datosResumen.push(newObj)
    this.sumaTicketsConReclamo = sumaCodigos
    this.totalTickets = data.length
    this.porcentajeConReclamos = ((this.sumaTicketsConReclamo * 100) / this.totalTickets).toFixed(0)
  }

  getTablaDetalle(data, columns) {
    this.order = columns
    this.updatedAt = Date()
    this.dataTablaDetalle = this.orderKeys(data, columns)
    this.formatDetalle()
    this.loadingDetalle = false
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
				col = { field: key, text: key, size: "160px", sortable: true };
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
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: true };
      } else if(key === "TICKET") {
				col = { field: key, text: key, size: "80px", sortable: true };
      } else if(key === "PAIS") {
				col = { field: key, text: key, size: "80px", sortable: true, hidden: true };
      } else if(key === "AREA") {
				col = { field: key, text: key, size: "170px", sortable: true };
      } else if(key === "CATEGORIA DE CIERRE") {
				col = { field: key, text: key, size: "180px", sortable: true };
      } else if(key === "CODIGO DE CIERRE") {
				col = { field: key, text: key, size: "250px", sortable: true };
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

  eliminarDuplicados(data, key):any[] {//Revisa el array de marcadores y elimina duplicados
		return [
			...new Map(data.map(item => [key(item), item])).values()
		]
	}

  convertirDatosResumen(data) {
    let j = 1
    const datos = []
    data.map(obj => {
      const NewObj = { recid: j, ...obj }
      j++
      datos.push(NewObj)
    })
    return datos
  }

  filtrarDatosResumen(filtro, data, filterName) {
    let filtros = []
    let dataFiltrada = []
    filtro.map(item => {
      const datosFiltrados = data.filter(ticket => ticket[filterName] === item)
      filtros.push(datosFiltrados)
    })
    filtros.map(ticket => {ticket.map(item => dataFiltrada.push(item))})
    dataFiltrada = this.eliminarDuplicados(dataFiltrada, item => item)
    return dataFiltrada
  }

  getCode(item) {
    console.log(item)
  }
}
