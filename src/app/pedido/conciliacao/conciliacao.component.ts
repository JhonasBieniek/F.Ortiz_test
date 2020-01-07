import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialogConfig, MatDialog, MatTabChangeEvent, MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { NotificationService } from '../../shared/messages/notification.service';
import { DialogAddNotaComponent } from './dialog-add-nota/dialog-add-nota.component';

import page from './steps.json';

@Component({
  selector: 'app-conciliacao',
  templateUrl: '../default.html',
  styleUrls: ['./conciliacao.component.css']
})

@Injectable()
export class ConciliacaoComponent implements OnInit {
  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  page:any = page;
  steps: any = this.page.concilicacao;
  defaultTab = 0;

  itemSelected

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};               
  
  constructor(
    private notificationService: NotificationService,
    private clientservice: ClientService, 
    private dialog: MatDialog
  ) {
      this.loadData();
    }

  ngOnInit() {
   
  }

  loadData(){
    this.clientservice.getNotas().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.status == e.step);
        i++;
      });
      this.rows = [...this.temp];
    });                     
  }

  add(){
    this.openDialog()
  }
  
  clearSelected(){
    this.selected = [];
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '90vw',
      height: '95vh'
    }
    let dialogRef = this.dialog.open(
      DialogAddNotaComponent, 
      dialogConfig, 
    );
    dialogRef.afterClosed().subscribe(value => {
      if(value == true){
        this.notificationService.notify("Nota adicionada com sucesso !")
        this.selected = [];
      }
    });
  }
  
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(d => {
      if( d.num_nota.toLowerCase().indexOf(val) !== -1 || !val 
      || d.pedido.num_pedido.toLowerCase().indexOf(val) !== -1 || !val)
      return d
    });
  }

  onSelect() {
  }

  onTabChange(event: MatTabChangeEvent) {
    this.defaultTab = event.index;
    console.log(this.defaultTab, "tab change");
    window.dispatchEvent(new Event('resize'));
    this.selected =[];
  }

}