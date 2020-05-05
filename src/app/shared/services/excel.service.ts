import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(steps:any [], json: any[], excelFileName: string): void {
    let wb= {SheetNames:[], Sheets:{}};
    for(const [idx, step] of steps.entries()){
      console.log(step.titulo);
      let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[idx]);
      wb.SheetNames.push(step.titulo);
      wb.Sheets[step.titulo] = ws;
    }
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
