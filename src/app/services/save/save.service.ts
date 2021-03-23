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
   * @param json - arreglo de datos.
   * @param excelFileName - nombre del archivo.
   */
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  /**
   * @param buffer - datos (respueta tipo blob).
   * @param fileName - nombre del archivo.
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    let filename = `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
    FileSaver.saveAs(data, filename);
  }
  /**
   * @param response - datos recibidos del servidor (respueta tipo blob).
   * @param fileName - nombre del archivo.
   */
  public saveAsPDFFile(response: any, fileName: string): void {
    let fileBlob = response;
    let blob = new Blob([fileBlob], {
      type: PDF_TYPE // must match the Accept type
    });
    let filename = `${fileName}_export_${new Date().getTime()}${PDF_EXTENSION}`;
    FileSaver.saveAs(blob, filename);
  }
  /**
   * @param response - datos recibidos del servidor (respueta tipo blob).
   * @param fileName - nombre del archivo.
   */
  public saveAsPNGFile(response: any, fileName: string): void {
    let fileBlob = response;
    let blob = new Blob([fileBlob], {
      type: PNG_TYPE // must match the Accept type
    });
    let filename = `${fileName}_export_${new Date().getTime()}${PNG_EXTENSION}`;
    FileSaver.saveAs(blob, filename);
  }
}
