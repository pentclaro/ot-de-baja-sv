import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-form-dialog',
	templateUrl: './form-dialog.component.html',
	styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

	list: Array<any> = [];
	model: any = {};
	formData: any = {};
	@ViewChild('form', { static: false }) form: NgForm;
	constructor(public dialogRef: MatDialogRef<FormDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit(): void {
		this.formData = this.data;
		this.list = Object.keys(this.formData.data);
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
