import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Column, Search, Show, Record, ColumnGroups, Item } from 'src/app/interfaces/interfaces'
import { HeaderService } from 'src/app/services/header.service';
import { FallasFibraOpticaService } from 'src/app/services/fallas-fibra-optica/fallas-fibra-optica.service';
import { FaultFallasFOService } from 'src/app/services/fallas-fibra-optica/fault-fallas-fo.service';
import { Chart } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

@Component({
  selector: 'app-fallas-fibra-optica',
  templateUrl: './fallas-fibra-optica.component.html',
  styleUrls: ['./fallas-fibra-optica.component.scss']
})
export class FallasFibraOpticaComponent implements OnInit {
  paises: string[] = ['Regional', 'Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica']
  regiones: string[] = []
  rangos: string[] = ['Diario', 'Semanal', 'Mensual']
  search: { pais: string, region: string[], rango: string } = { pais: '', region: [], rango: '' }
  loading: boolean = false
  loadingDetalle = false
  updatedAt = ''
  reporteCargado = false
  tituloReporte = 'Fallas Fibra Optica'
  dataSourceResumen = []
  dataTablaPromedios = []
  conAfectacion = false
  sinAfectacion = false
  orderResumen: any
  orderPromedios: any
  nameResumen = 'ResumenFallasFO'
  namePromedios = 'TablaPromedios'
  headerResumen = 'Resumen Fallas Fibra Optica'
  headerPromedios = 'Tabla de Promedios'
  itemsResumen: Item
  itemsPromedios: Item
  showResumen: Show = { toolbar: true, footer: true, header: false, toolbarColumns: false, toolbarInput: false, toolbarSearch: false, toolbarReload: false }
  searchesResumen: Search[] = []
  searchesPromedios: Search[] = []
  columnsResumen: Column[] = []
  columnsPromedios: Column[] = []
  groupsResumen: ColumnGroups[] = []
  // groupsPromedios: ColumnGroups[] = []
  myChartCantidades: any;
  myChartPromedios: any;
  cleanChecks: boolean;

  @ViewChild('form', { static: false }) form: NgForm;


  constructor(
    private _pageService: HeaderService,
    private _fallasFibraOpticaService: FallasFibraOpticaService,
    private _faultFallasFOService: FaultFallasFOService,
  ) { }

  ngOnInit(): void {
  }

  // FUNCION PARA DETECTAR SELECCION DEL USUARIO EN CUALQUIER INPUT
  optionSelected(input): void {
    if (input === this.search.pais) {// FRAGMENTO ESPECIFICO DEL FILTRO DE PAIS
      this.getDataRegiones(this.search.pais)
    } else {// FRAGMENTO PARA FILTRO DE REGION
      if (input[0] === 'TODAS') {// SI SE SELECCIONA TODOS, SE LLENAN TODAS LAS OPCIONES DEL INPUT
        this.search.region = this.regiones
        this.cleanChecks = true
      } else {
        this.cleanChecks = false
      }
      if (this.cleanChecks === false && input.length === this.regiones.length - 1) {
        this.search.region = []
      }
    }
  }

  searchData(form): void {
    this.loading = true;
    this.loadingDetalle = true;
		this.form.form.markAllAsTouched();
		if (this.form.valid) {
      this.updatedAt = Date();
      this.reporteCargado = true
      this.getDataTablaResumen(this.search)
      this.getDataTablaPromedios()
		} else {
      this._pageService.openSnackBar(`warning`, `Error selecciona todos los campos.`);
			this.loading = false
		}
  }

  getDataRegiones(pais: string) {
    this.regiones = []
    this._faultFallasFOService.getDataRegiones(pais).subscribe((data: any) => {
      data.map(region => {
        this.regiones.push(region.REGION)
      })
      this.regiones.unshift('TODAS')
    })
  }

  getDataTablaResumen(search?) {
    this._fallasFibraOpticaService.getDataTablaResumen(search).subscribe(({ data, message }: any) => {
      let datos = data.data

      // INICIALIZACIÓN DE VARIABLE CONTADORA PARA CICLOS
      let j: number;

      /* INICIALIZACION DE VARIABLES PARA ARMADO DE TABLAS */
      // CONTENEDORES DE COLUMNAS DE PORCENTAJES
      let porcentaje1 = [];
      let porcentaje2 = [];
      let porcentaje3 = [];
      let porcentaje4 = [];
      let porcentaje5 = [];
      let porcentaje6 = [];

      // CONTENEDORES DE COLUMNAS DE CANTIDADES
      let cantidades1 = [];
      let cantidades2 = [];
      let cantidades3 = [];
      let cantidades4 = [];
      let cantidades5 = [];
      let cantidades6 = [];

      let rangoA = "0 ⩽ 5 hrs"; // Contenedores de distintos rangos para realizar cálculos
      let rangoB = "＞5 ⩽ 12 hrs";
      let rangoC = "＞12 ⩽ 24 hrs";
      let rangoD = "＞24 hrs";

      let columnaRango = []; // Contenedor de primera columna que almacena los rangos, y los títulos de toda las filas de la tabla

      let filasTabla = []; // Array que contiene toda la composición de la tabla y su información

      let encabezadosFechas = []; // Contenedor de fechas para armar los grupos de encabezados
      let gruposCol = [] // Array que se utiliza para definir los grupos de columnas
      let todasCantidades = []; // Array que guarda todas las cantidades para realizar el total
      let sumaCantidades = []; // Contenedor de toda la suma de las cantidades

      // If encargado de verificar el tiempo seleccionado
      columnaRango = [rangoA, rangoB, rangoC, rangoD, "Total"]; // Array que almacena la primera columna de la tabla

      for (var i = 0; i <= 3; i++) {
        porcentaje1.push(parseFloat(datos[i].PORCENTAJE).toFixed(2));
        cantidades1.push(parseInt(datos[i].TOTAL));
      }
      for (var i = 4; i <= 7; i++) {
        porcentaje2.push(parseFloat(datos[i].PORCENTAJE).toFixed(2));
        cantidades2.push(parseInt(datos[i].TOTAL));
      }
      for (var i = 8; i <= 11; i++) {
        porcentaje3.push(parseFloat(datos[i].PORCENTAJE).toFixed(2));
        cantidades3.push(parseInt(datos[i].TOTAL));
      }
      for (var i = 12; i <= 15; i++) {
        porcentaje4.push(parseFloat(datos[i].PORCENTAJE).toFixed(2));
        cantidades4.push(parseInt(datos[i].TOTAL));
      }
      for (var i = 16; i <= 19; i++) {
        porcentaje5.push(parseFloat(datos[i].PORCENTAJE).toFixed(2));
        cantidades5.push(parseInt(datos[i].TOTAL));
      }
      for (var i = 20; i <= 23; i++) {
        porcentaje6.push(parseFloat(datos[i].PORCENTAJE).toFixed(2));
        cantidades6.push(parseInt(datos[i].TOTAL));
      }

      if (this.search.rango === 'Semanal') {// If encargado de insertar datos a array de encabezado, si rango es semanal, los convierte en número entero, sino solo inserta los datos
        encabezadosFechas = [parseInt(datos[0].FECHA), parseInt(datos[4].FECHA), parseInt(datos[8].FECHA), parseInt(datos[12].FECHA), parseInt(datos[16].FECHA), parseInt(datos[20].FECHA)]
      } else {
        encabezadosFechas = [datos[0].FECHA, datos[4].FECHA, datos[8].FECHA, datos[12].FECHA, datos[16].FECHA, datos[20].FECHA]
      }

      todasCantidades.push(cantidades1, cantidades2, cantidades3, cantidades4, cantidades5, cantidades6) // Insersión de arrays a todasCantidades
      sumaCantidades = todasCantidades.map((item) => item.reduce((a, b) => a + b, 0)) // Método que realiza la suma de todas las cantidades en todasCantidades y almacena el resultado en sumaCantidades

      /* CREACIÓN DE COMPOSICIÓN DE TABLAS ORDENADAS POR FILAS */
      /* La tabla se realiza por medio de objetos que cada una representa una fila e inserta de forma manual cada columna y el valor que contendrá */
      for (j = 0; j < cantidades1.length; j++) {
        filasTabla.push({
          recid: j + 1,
          Rango: columnaRango[j],
          "%1": `${porcentaje1[j]}%`,
          "#1": cantidades1[j],
          "%2": `${porcentaje2[j]}%`,
          "#2": cantidades2[j],
          "%3": `${porcentaje3[j]}%`,
          "#3": cantidades3[j],
          "%4": `${porcentaje4[j]}%`,
          "#4": cantidades4[j],
          "%5": `${porcentaje5[j]}%`,
          "#5": cantidades5[j],
          "%6": `${porcentaje6[j]}%`,
          "#6": cantidades6[j],
          "Hide": null,
        });
      }

      filasTabla.push(// Se agrega la última línea de la tabla que contiene los totales de las sumas de las cantidades
        {
          recid: j + 1,
          Rango: columnaRango[j],
          "%1": " ",
          "#1": sumaCantidades[0],
          "%2": " ",
          "#2": sumaCantidades[1],
          "%3": " ",
          "#3": sumaCantidades[2],
          "%4": " ",
          "#4": sumaCantidades[3],
          "%5": " ",
          "#5": sumaCantidades[4],
          "%6": " ",
          "#6": sumaCantidades[5],
          "Hide": " "
        }
      );

      let filtroRango = ''
      if (this.search.rango === 'Semanal') {
        filtroRango = 'Semana '
      } else {
        filtroRango = ''
      }

      /* Insersión de datos a array gruposCol para realizar la agrupación de columnas */
      gruposCol = [
        { span: 2, text: '' },
        { span: 2, text: `${filtroRango}${encabezadosFechas[0]}` },
        { span: 2, text: `${filtroRango}${encabezadosFechas[1]}` },
        { span: 2, text: `${filtroRango}${encabezadosFechas[2]}` },
        { span: 2, text: `${filtroRango}${encabezadosFechas[3]}` },
        { span: 2, text: `${filtroRango}${encabezadosFechas[4]}` },
        { span: 2, text: `${filtroRango}${encabezadosFechas[5]}` },
      ];

      let cantidadesTotales = [porcentaje1, porcentaje2, porcentaje3, porcentaje4, porcentaje5, porcentaje6]

      this.groupsResumen = gruposCol
      this.orderResumen = Object.keys(filasTabla[0])
      this.updatedAt = Date();
      this.dataSourceResumen = this.orderKeys(filasTabla, Object.keys(filasTabla[0]));
      this.format();
      columnaRango.pop()
      this.graficaBarrasResumen(columnaRango, encabezadosFechas, cantidadesTotales, 'Porcentajes Falla', 'graficaPorcentajes')
      this._pageService.openSnackBar(`success`, message);
      this.loadingDetalle = false;
      this.loading = false;
      this.reporteCargado = true
    },
    (error) => {
      this._pageService.openSnackBar('error', error)
      this.loading = false
      this.loadingDetalle = false
    })
  }

  getDataTablaPromedios(search?) {
    this._fallasFibraOpticaService.getDataTablaPromedios().subscribe(({data, message}: any) => {
      console.log(data)
      this.orderPromedios = data.order
      let datos = data.data
      this.updatedAt = Date()
      datos.map(promedio => promedio.PROM = parseFloat(promedio.PROM).toFixed(2))
      this.dataTablaPromedios = this.orderKeys(datos, data.info)
      this.formatPromedios()

      let fechas = []
      let cantidades = []
      let promedios = []

      datos.map(dato => {
        if (this.search.rango === 'Semanal') {
          fechas.push(parseInt(dato.FECHA))
          cantidades.push(parseInt(dato.CANTIDAD))
        } else {
          fechas.push(dato.FECHA)
          cantidades.push(parseInt(dato.CANTIDAD))
        }
        promedios.push(parseFloat(dato.PROM))
      })

      this.graficaBarrasPromedios(fechas, cantidades, promedios, 'graficaPromedios', '#000')

    })
  }

  graficaBarrasResumen(labels: string[], fechas: string[], cantidades: any[], name: string, idElement: string, colors?: string[]) {
    let barrasGrafica = []
    let j = 0
    fechas.map(item => {
      barrasGrafica.push({
        type: "bar", // Se le aasigna el valor de tipo de gráfica
        label: item, // Acá se asigna los títulos para la leyenda de cada fecha
        backgroundColor: '#000', // Acá se asigna el color de la barra
        data: cantidades[j], // Acá asignamos los datos con los que se formará la barra
        stack: j + 1,
      })
      j++
    })

    const data = {
      labels: labels,
      datasets: barrasGrafica
    }

    // const reducer = (accum, curr) => accum + curr
    // const sumaCants = cantidades.reduce(reducer)
    // console.log(sumaCants)

    // this.myChart.destroy()
    let canvas = document.getElementById(idElement) as HTMLCanvasElement | null;
    canvas.getContext('2d')
    this.myChartCantidades = new Chart(canvas, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {// Acá manipulamos las escalas del rango X y Y
          yAxes: [// Manipulación de escala en eje Y
            {
              id: "Y", // Declaramos un ID para identificar el eje Y
              position: "left",
              ticks: {// Formato que tienen los valores que están en el eje Y
                fontSize: 14,
                fontColor: "#464646",
              },
            },
          ],
          xAxes: [// Manipulación de escala en eje X
            {
              id: "X", // Declaramos un ID para identificar el eje X
              position: "bottom",
              ticks: {// Formato que tienen los valores que están en el eje Y
                fontSize: 14,
                fontColor: "#5c5c5c",
                fontFamily: "Operator Mono Lig",
              },
            },
          ],
        },
        legend: {// Acá le damos formato de las leyendas para identificar los títulos de las barras
          labels: {
            fontSize: 14,
            fontColor: "#2a2a2a",
          },
          position: "top",
        },
        plugins: {
          datalabels: {// Acá se coloca la información de la barra en la parte superior de cada una
            anchor: "end",
            align: "end"
          },
          tooltip: {},
          legend: {
            labels: {
              padding: 20
            }
          },
        },
      },
    })

    canvas.onclick = (e) => {
      const event = this.myChartCantidades.getElementAtEvent(e)[0]
      if (event) {
        const label = this.myChartCantidades.data.labels[event._index]
        const value = this.myChartCantidades.data.datasets[event._datasetIndex].data[event._index]

        // this.getFallasReiniciosEquiposIP(label, this.initDate, this.endDate, undefined)
      }
    }
  }

  graficaBarrasPromedios(labels: any[], cantidades: any[], promedios: any[], idElement: string, color?: string) {
    const data = {
      labels: labels,
      datasets: [
        {
          type: "bar",
          data: cantidades,
          backgroundColor: color,
          stack: "combined",
          yAxisID: "Y1",
        },
        {
          type: "line",
          data: promedios,
          borderColor: "rgba(255,0,0,0.4)",

          borderDash: [5, 5],
          backgroundColor: "transparent",
          pointBackgroundColor: "rgba(255,0,0,0.4)",
          pointHoverBackgroundColor: "rgba(255,0,0,0.4)",
          pointRadius: 3,
          stack: "combined",
          yAxisID: "Y2",
          fill: false,
        },
      ]
    }

    let canvas = document.getElementById(idElement) as HTMLCanvasElement | null;
    canvas.getContext('2d')
    this.myChartPromedios = new Chart(canvas, {
      type: 'bar',
      data: data,
      options: {// Con este objeto manipulamos los objetos específicos dentro de la tabla
        responsive: true, // Parámetro que declara la gráfica responsiva a cualquier tamaño
        maintainAspectRatio: false,
        scales: { // Acá manipulamos las escalas del rango X y Y
          yAxes: [// Manipulación de escala en eje Y
            {
              id: "Y1", // Declaramos un ID para identificar el eje Y
              position: "left",
              ticks: {// Formato que tienen los valores que están en el eje Y
                fontSize: 14,
                fontColor: "#464646",
              },
            },
            {
              id: "Y2", // Declaramos un ID para identificar el eje Y
              position: "right",
              ticks: { // Formato que tienen los valores que están en el eje Y
                fontSize: 14,
                fontColor: "#464646",
                min: 0, // Definimos el valor mínimo de la escala
              },
            },
          ],
          xAxes: [ // Manipulación de escala en eje X
            {
              id: "X", // Declaramos un ID para identificar el eje X
              position: "bottom",
              ticks: {
                // Formato que tienen los valores que están en el eje Y
                fontSize: 14,
                fontColor: "#464646",
              },
            },
          ],
        },
        legend: {// Acá le damos formato de las leyendas para identificar los títulos de las barras
          display: false,
          labels: {
            fontSize: 14,
            fontColor: "#2a2a2a",
          },
          position: "top",
        },
        plugins: {
          tooltip: {},
        },
      },
    })

    canvas.onclick = (e) => {
      const event = this.myChartCantidades.getElementAtEvent(e)[0]
      if (event) {
        const label = this.myChartCantidades.data.labels[event._index]
        const value = this.myChartCantidades.data.datasets[event._datasetIndex].data[event._index]

        // this.getFallasReiniciosEquiposIP(label, this.initDate, this.endDate, undefined)
      }
    }
  }

  format(): void {
    let data = this.orderResumen || [];
		this.searchesResumen = [];
		this.columnsResumen = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: true };
			} else if (key === "Rango") {
				col = { field: key, text: "<div style='text-align: center;'>Rango</div>", size: "100px", sortable: true };
			} else if (key === "%1" || key === "%2" || key === "%3" || key === "%4" || key === "%5" || key === "%6") {
        col = { field: key, text: "<div style='text-align: center;'>%</div>", size: "70px", sortable: true };
      } else if (key === "#1" || key ==="#2" || key === "#3" || key === "#4" || key === "#5" || key === "#6") {
        col = { field: key, text: "<div style='text-align: center;'>#</div>", size: "70px", sortable: true };
      } else if (key === "Hide") {
        col = { field: key, text: key, size: "70px", sortable: true, hidden: true };
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

  formatPromedios(): void {
    let data = this.orderPromedios || [];
		this.searchesPromedios = [];
		this.columnsPromedios = [];
		data.map((key: string) => {
			let col: Column, search: Search;
			if (key === "recid") {
				col = { field: key, text: key, size: "41px", frozen: false, sortable: true, hidden: true };
			} else if(key === "ANIO") {
				col = { field: key, text: 'AÑO', size: "80px", sortable: true };
			} else if(key === "PROM") {
				col = { field: key, text: 'PROMEDIO', size: "80px", sortable: true };
			} else {
				col = { field: key, text: key, size: "80px", sortable: true };
			}
			this.columnsPromedios.push(col);
			if (key === "recid") {
				search = { field: key, label: key, type: 'int', hidden: true };
			} else {
				search = { field: key, label: key, type: 'text' };
			}
			this.searchesPromedios.push(search);
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
