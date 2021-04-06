import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const PDF_TYPE = 'application/pdf';
const PDF_EXTENSION = '.pdf';
const PNG_TYPE = 'application/png';
const PNG_EXTENSION = '.png';

@Injectable({
	providedIn: 'root'
})
export class SaveFileService {
	constructor() { }

	/**
	 * @param html - html doom <table /> HTMLElement | Element.
	 * @param excelFileName - nombre del archivo.
	 */
	public exportTableAsExcelFile(html: HTMLElement | Element, excelFileName: string): void {
		const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(html);
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
		const buffer: ArrayBuffer = new ArrayBuffer(excelBuffer.length);
		const view: Uint8Array = new Uint8Array(buffer);
		for (let i = 0; i < excelBuffer.length; i++) {
			view[i] = excelBuffer.charCodeAt(i) & 0xFF
		};
		this.saveAsExcelFile(buffer, excelFileName);
	};

	/**
	 * @param json - arreglo de datos.
	 * @param excelFileName - nombre del archivo.
	 */
	public exportAsExcelFile(json: Array<any>, excelFileName: string): void {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	};

	/**
	 * @param buffer - datos (respueta tipo blob).
	 * @param fileName - nombre del archivo.
	 */
	private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
			type: EXCEL_TYPE
		});
		const filename = `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
		FileSaver.saveAs(data, filename);
	};

	/**
	 * @param buffer - datos recibidos del servidor (respueta tipo blob).
	 * @param fileName - nombre del archivo.
	 */
	public saveAsPDFFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
			type: PDF_TYPE // must match the Accept type
		});
		const filename = `${fileName}_export_${new Date().getTime()}${PDF_EXTENSION}`;
		FileSaver.saveAs(data, filename);
	};

	/**
	 * @param buffer - datos recibidos del servidor (respueta tipo blob).
	 * @param fileName - nombre del archivo.
	 */
	public saveAsPNGFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
			type: PNG_TYPE // must match the Accept type
		});
		const filename = `${fileName}_export_${new Date().getTime()}${PNG_EXTENSION}`;
		FileSaver.saveAs(data, filename);
	};

}
