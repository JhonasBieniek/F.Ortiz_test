import { Component, OnInit, ViewChild, Injectable, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../../shared/services/client.service.component';
import { MatDialogConfig, MatDialog, MatTabChangeEvent, MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { NotificationService } from '../../shared/messages/notification.service';
import { DialogAddNotaComponent } from './dialog-add-nota/dialog-add-nota.component';
import { DialogViewNotaComponent } from './dialog-view-nota/dialog-view-nota.component';
import { DialogEditNotaComponent } from './dialog-edit-nota/dialog-edit-nota.component';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';

import page from './steps.json';
import { Observable } from 'rxjs';
import {pluck, switchMap, map} from 'rxjs/operators';


@Component({
  selector: 'app-conciliacao',
  templateUrl: './conciliacao.component.html',
  styleUrls: ['./conciliacao.component.css'],
  encapsulation: ViewEncapsulation.None

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

  action: string = "conciliacao";

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};               
  
  constructor(
    private notificationService: NotificationService,
    private clientservice: ClientService, 
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.loadData();
    }

  ngOnInit() {
   
  }

  loadData() {
    this.clientservice.getNotas().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => {
          if(d.status == 'parcial' && e.step == 'aberto') {
            d.status = 'parcial'
            return d 
          }
          if (d.status == e.step)
          return d 
          });
        i++;
      });
      this.rows = [...this.temp].sort((a,b)=> a.id - b.id);
    });
  }


  add(path){
    this.openDialog()
  }
  
  clearSelected(){
    this.selected = [];
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '85vh',
      width: '90vw',
      height: '85vh'
    }
    let dialogRef = this.dialog.open(
      DialogAddNotaComponent, 
      dialogConfig, 
    );
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
    });
  }

  view(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '90vw',
      height: '95vh',
      data: data
    }
    let dialogRef = this.dialog.open(
      DialogViewNotaComponent, 
      dialogConfig, 
    );
    dialogRef.afterClosed().subscribe(value => {
      this.loadData();
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