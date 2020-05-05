import { Component, OnInit, ElementRef, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
import { ClientService } from '../../shared/services/client.service.component';
import { ExcelService } from '../../shared/services/excel.service';
import { NgxSpinnerService } from "ngx-spinner";

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
@Injectable()

export class ImportarComponent implements OnInit {
  page = {
    titulo: "Importar lista de recebimentos"
  }
  representadas:any;
  representada:any;
  rows:any = [];
  temp:any = [];
  steps:any = [];
  selected:any = [];

  defaultTab = 0;

  @ViewChild("fileInput", { static: true }) fileInput: ElementRef;
  constructor(
    public dialog: MatDialog,
    public clientService: ClientService,
    private spinner:NgxSpinnerService,
    private excelService:ExcelService) { }
 
  ngOnInit() {
    this.clientService.getRepresentadas().subscribe((res:any) => {
      this.representadas = res.data;
    })
  }

  loadFile(){
    this.fileInput.nativeElement.click();
    this.rows = [];
    this.temp = [];
    this.steps = [];
  }

  incomingfile(evt) {
    this.spinner.show();
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Não utilize multiplos arquivos');
    const reader: FileReader = new FileReader();
    reader.onload = (e:any) => {
      const bstr:any = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary', cellDates: true});
      const wsname: string = wb.SheetNames[1];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.spinner.hide();
      this.clientService.chkParcelas(this.representada, XLSX.utils.sheet_to_json(ws, { header: 1, range:8, dateNF:'dd/MM/YYYY' }) ).subscribe((res:any) => {
        let stemp = [...new Set (res.data.map(obj => obj.status))];
        stemp.forEach(e => {
          let filter = res.data.filter(d => d.status == e);
          this.steps.push({
            titulo: e,
            columns: Object.keys(filter[0])
              .filter(obj => !["status","nota"].includes(obj))
              .map(obj => { return  this.editColumns(obj)})
          });
          this.temp.push(filter);
        });
        this.rows = [...this.temp];
      })
    }
    reader.readAsBinaryString(target.files[0]);
  }

  editColumns(data){
    let res:any = {
      prop: data,
      name: data.charAt(0).toUpperCase() + data.slice(1),
      width: 1
    };
    switch(data){
      case "cliente":{
        res.width = 2
      };
      default:
    }
    return res;
  }

  clickExcel(){
    this.excelService.exportAsExcelFile(this.steps, this.rows, 'fibo');
  }

  onTabChange(event: MatTabChangeEvent) {
    this.defaultTab = event.index;
    console.log(this.defaultTab, "tab change");
    window.dispatchEvent(new Event('resize'));
    this.selected =[];
  }

}
