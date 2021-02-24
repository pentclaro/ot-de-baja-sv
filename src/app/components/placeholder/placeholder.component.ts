import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent implements OnInit {

  @Input() message: any; // se agrega el contenido del texto en la vista del placeholder el cual pude ser dinámico
  @Input() loading: boolean; // si el valor es verdadero se muestra un loader hasta que del lado de la aplicación se indique que se completo la carga

  constructor() { }

  ngOnInit() {
  }

}
