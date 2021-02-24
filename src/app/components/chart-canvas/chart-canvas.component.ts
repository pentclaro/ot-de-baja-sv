import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart-canvas',
  templateUrl: './chart-canvas.component.html',
  styleUrls: ['./chart-canvas.component.scss']
})
export class ChartCanvasComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [{}]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType = 'bar';

  @Input() public data: any[] = [];
  @Input() public labes: string[] = [];
  @Input() public colors: string[] = [];
  @Input() public yAxes: boolean = false;
  @Input() public legend: boolean = false;
  @Input() public type: string = 'bar';
  @Input() public height: number = 200;
  @Input() public control: boolean = false;

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public lineChartPlugins = [{
    plugins: {
      streaming: false,
    },
  }];

  y2Axes: any = [
    {
      id: 'y-axis-0',
      position: 'left',
    },
    {
      id: 'y-axis-1',
      position: 'right',
      gridLines: {
        color: 'rgba(255,0,0,0.3)',
      },
      ticks: {
        fontColor: 'red',
      }
    }
  ];
  constructor() { }

  ngOnInit(): void {
    this.processData();
  }

  processData() {
    this.colors.forEach(element => {
      let color = {
        backgroundColor: `${element}33`,
        borderColor: `${element}FF`,
        pointBackgroundColor: `${element}FF`,
        pointBorderColor: `#fff`,
        pointHoverBackgroundColor: `#fff`,
        pointHoverBorderColor: `${element}FF`
      }
      this.lineChartColors.push(color);
    });
    this.lineChartLabels = this.labes;
    this.lineChartLegend = this.legend;
    if (this.yAxes) {
      this.lineChartOptions.scales.yAxes = this.y2Axes
    } else {
      this.lineChartOptions = {
        responsive: true, scales: {
          yAxes: [{
            id: 'y-axis-0',
            position: 'left',
          }]
        }, annotation: {}
      }
    }
    if (!this.type !== true) {
      if (this.type == 'pie' || this.type == 'radar') {
        this.lineChartOptions = {
          responsive: true, scales: {
            yAxes: [{
              id: 'y-axis-0',
              position: 'left',
            }]
          }, annotation: {}
        }
      }
      this.lineChartType = this.type;
    }
    this.lineChartData = this.data;
    this.chart.update();
  }

  change(type: string) {
    this.lineChartType = type;
  }

  ngOnChanges(changes: SimpleChanges) {
    //Action for change
    if (this.type == 'pie' || this.type == 'radar') {
      this.lineChartOptions = { responsive: true, scales: {}, annotation: {} }
    } else {
      if (this.yAxes) {
        this.lineChartOptions.scales.yAxes = this.y2Axes
      } else {
        this.lineChartOptions = {
          responsive: true, scales: {
            yAxes: [{
              id: 'y-axis-0',
              position: 'left',
            }]
          }, annotation: {}
        }
      }
    }
    if (!this.type !== true) {
      this.lineChartType = this.type;
    }
    this.chart.update();
  }

}
