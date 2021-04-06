import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  type: string;
  message: string;
  types: any ={
    error: 'error_outline',
    success: 'done_outline',
    warning: 'warning'
  };
  icon: string = 'icon';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {type: string, message: string}) { }

  ngOnInit(): void {
    this.type = this.data.type;
    this.icon = this.types[this.data.type];
    this.message = this.data.message;
  }

}
