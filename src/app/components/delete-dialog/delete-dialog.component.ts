import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  Data: any = { message: "", data: {}, module: "" }; //change dataType object to any
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDefault: any) { }

  ngOnInit() {
    this.Data = this.dataDefault;
  }

  send(): void {
    this.dialogRef.close(this.Data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
