import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataDefault } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-message-ok-error',
  templateUrl: './message-ok-error.component.html',
  styleUrls: ['./message-ok-error.component.scss']
})
export class MessageOkErrorComponent implements OnInit {
  Data: any = { fullName: "", password: "" };
  constructor(public dialogRef: MatDialogRef<MessageOkErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDefault: DialogDataDefault) { }

  ngOnInit() {
    this.Data = this.dataDefault;
  }

  send(): void {
    this.dialogRef.close(this.Data);
  }
  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

}
