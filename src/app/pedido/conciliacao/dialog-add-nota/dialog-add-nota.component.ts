import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTabChangeEvent, MatBottomSheetRef, MatBottomSheet , MatDialogRef} from '@angular/material';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogSendNotaComponent } from './dialog-send-nota/dialog-send-nota.component';

import steps from './steps.json';

@Component({
  selector: 'app-dialog-add-nota',
  templateUrl: './dialog-add-nota.component.html',
  styleUrls: ['./dialog-add-nota.component.css']
})
export class DialogAddNotaComponent implements OnInit {

  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  steps: any = steps.pedidos;
  defaultTab = 0;

  itemSelected

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};     
  constructor(
    private clientservice: ClientService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddNotaComponent>,
    private notificationService: NotificationService
  ) { 
    this.loadData();
  }

  ngOnInit() {

  }

  loadData() {
    this.clientservice.getPedidoSemNota().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.status == e.step);
        i++;
      });
      this.rows = [...this.temp];
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  dta(data){
    let dateNow = Date.now();
    let dateCreated:any = new Date(data.seconds*1000);
    let dif = Math.abs(dateNow.valueOf() - dateCreated.valueOf())
    let m = (Math.ceil(dif)/(1000))
    // set minutos p segundos
    var seconds = m 
    // calcula (e subtrai) dias inteiros
    var days = Math.floor(seconds / 86400);
    seconds -= days * 86400;
    // calcula (e subtrai) horas inteiros
    var hours = Math.floor(seconds / 3600) % 24;
    seconds -= hours * 3600;
    // calcula (e subtrai) minutos inteiros
    var minutes = Math.floor(seconds / 60) % 60;
    return days + 'd ' + hours + 'h ' + minutes + 'm ';
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function(d) {
      if( d.cliente.toLowerCase().indexOf(val) !== -1 || !val )
      return d
    }); 
  }

  filter(val) {
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function(d) {
      if( d.cliente.toLowerCase().indexOf(val) !== -1 || !val )
      return d
    }); 
  } 
  
  onSelect({ selected }) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '55vw',
      maxHeight: '45vh',
      width: '55vw',
      height: '45vh'
    }
    dialogConfig.data = selected[0];
    let dialogRef = this.dialog.open(
      DialogSendNotaComponent, 
      dialogConfig, 
    );
    dialogRef.afterClosed().subscribe(value => {
      if(value == true){
        this.notificationService.notify("Nota adicionada com sucesso !")
        this.selected = [];
        this.loadData();
      }
    });
  }

  valorSelected(){
    let valor: number = 0;
    this.selected.forEach(element => {
      valor +=element.valor;
    });
    return valor;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.defaultTab = event.index;
    console.log(this.defaultTab, "tab change");
    window.dispatchEvent(new Event('resize'));
    this.selected =[];
  }

}
