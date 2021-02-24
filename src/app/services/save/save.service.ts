import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const PDF_TYPE = 'application/pdf';
const PDF_EXTENSION = '.pdf';

@Injectable({
  providedIn: 'root'
})
export class SaveFileService {
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    let filename = `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
    FileSaver.saveAs(data, filename);
  }

  public saveAsPDFFile(response: any, fileName: string): void {
    let fileBlob = response;
    let blob = new Blob([fileBlob], {
      type: PDF_TYPE // must match the Accept type
    });
    let filename = `${fileName}_export_${new Date().getTime()}${PDF_EXTENSION}`;
    FileSaver.saveAs(blob, filename);
  }
}
