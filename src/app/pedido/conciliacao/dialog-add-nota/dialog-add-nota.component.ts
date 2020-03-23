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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function(d) {
      if( d.cliente.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
          d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 || !val ||
          d.num_pedido.toLowerCase().indexOf(val) !== -1 || !val )
      return d
    }); 
  }
  
  onSelect({ selected }) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '90vw',
      height: '95vh'
    }
    dialogConfig.data = selected[0];
    let dialogRef = this.dialog.open(
      DialogSendNotaComponent, 
      dialogConfig, 
    );
    dialogRef.afterClosed().subscribe(value => {
      if(value == true){
        this.selected = [];
        this.loadData();
      }
    });
  }
  

}
