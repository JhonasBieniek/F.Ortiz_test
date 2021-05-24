import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTabChangeEvent } from '@angular/material';
import { DialogConfirmarDeleteComponent } from '../../cadastro/dialog-confirmar-delete/confirmar-delete.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import page from './steps.json';


@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.css']
})
export class NovoComponent implements OnInit {
  data:any = [];
  dados:any = [];
  editing = {};
  isEditable = {};
  page:any = page;
  defaultTab = 0;
  selected:any = [];
  steps: any = this.page.homologacoes;
  rows = [];
  rows2 = [];
  rows3 = [];
  temp = [...this.data];
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;                           

  @ViewChild(NovoComponent, {static: false}) table: NovoComponent;
  constructor(private clientservice: ClientService, private dialog: MatDialog, private notificationService: NotificationService) {
    this.loadData();                                 
  }

  private loadData(){
    this.clientservice.getHomologacoes().subscribe((res:any) =>{
      let i = 0;
      this.steps.forEach(e => {
        this.temp[i] = res.data.filter(d => d.status == e.step);
        i++;
      });
      this.rows = [...this.temp].sort((a,b)=> a.id - b.id);
    });                     
  }
  
  updateFilter(event) {
  const val = event.target.value.toLowerCase();
      
  // filter our data
  const temp = this.temp.filter(function(d) {
    if( d.nome.toLowerCase().indexOf(val) !== -1 || !val 
    || d.regio.nome.toLowerCase().indexOf(val) !== -1 || !val 
    || d.vendedor.nome.toLowerCase().indexOf(val) !== -1 || !val)
    return d
  }); 
  // update the rows
  this.rows = temp;
  // Whenever the filter changes, always go back to the first page
  this.table = this.data;
  }
  updateValue(event, cell, rowIndex) {    
  this.editing[rowIndex + '-' + cell] = false;
  this.rows[rowIndex][cell] = event.target.value;
  this.rows = [...this.rows];
  console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  changeStatus(row){
    console.log(row);
    this.clientservice.updateHomologacao(row).subscribe((res) => {
      if(res.success == true){
        this.notificationService.notify("Atualizado com Sucesso!");
        this.temp = [];
        this.rows = [];
        this.loadData();
      }  
    });
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '90vw',
      height: '70vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyComponent, 
      dialogConfig, 
    
  );
    dialogRef.afterClosed().subscribe(value => {
        this.refreshTable();
        console.log(`Dialog sent: ${value}`); 
      });
  }

  refreshTable(){
    this.loadData();
  }
  delete(row){
    const dialogConfig = new MatDialogConfig();
      const tipo = 'homologations';
      dialogConfig.data = row
      dialogConfig.data.tipo = tipo
      let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig   
    );
    dialogRef.afterClosed().subscribe(value => {

     (value != 1) ? this.refreshTable() : null

      });
    }
    edit(row){
      let dialogConfig = new MatDialogConfig();
      dialogConfig = {
        maxWidth: '75vw',
        maxHeight: '85vh',
        width: '75vw',
        height: '75vh'
      }
        dialogConfig.data = row
        dialogConfig.data.action = 'edit'
        let dialogRef = this.dialog.open(DialogBodyComponent,
        dialogConfig   
      );
      dialogRef.afterClosed().subscribe(value => {
  
       (value != 1) ? this.refreshTable() : null
  
        });
      }

      onTabChange(event: MatTabChangeEvent) {
        this.defaultTab = event.index;
        window.dispatchEvent(new Event('resize'));
        this.selected =[];
      }

  ngOnInit() {
   
  }

}