import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataDefault } from 'src/app/interfaces/interfaces';
// import { UserService } from 'src/app/services/user/user.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  list: string[] = [];
  Data: any = { fullName: "", password: "" };
  tmpData: any = {};
  fullName: string = "";
  password: string = "";
  message: string;
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    // private userService: UserService,
    private pageService: HeaderService,
    @Inject(MAT_DIALOG_DATA) public dataDefault: DialogDataDefault) { }

  ngOnInit() {
    this.Data = this.dataDefault;
    this.tmpData.id = this.Data.data.id;
    this.tmpData.fullName = this.Data.data.fullName;
    this.tmpData.password = "";
    this.tmpData.newPassword = "";
    this.tmpData.confirmPassword = "";
    debugger
  }

  updatePassword() {
    // this.userService.update(this.tmpData).subscribe((data: any) => {
    //   this.pageService.openSnackBar(`success`, `Contraseña actualizada correctamente.`);
    // }, (error: any) => {
    //   this.pageService.openSnackBar(`error`, `Error al actualizar la contraseña, intenta de nuevo más tarde.`);
    // })
  }

  send(): void {
    this.updatePassword();
    this.dialogRef.close(this.Data);
  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

}
