import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataDefault } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

  list: any[] = [];
  model: any = {};
  formData: any = {};
  constructor(public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataDefault) { }

  ngOnInit(): void {
    this.formData = this.data;
    this.list = this.formData.list;
    this.list.forEach(element => {
      this.model[element] = this.formData.data[element];
    });
  }

  send(): void {
    this.dialogRef.close(this.model);
  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

}
