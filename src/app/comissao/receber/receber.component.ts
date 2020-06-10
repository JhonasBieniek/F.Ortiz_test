import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-receber',
  templateUrl: './receber.component.html',
  styleUrls: ['./receber.component.css']
})
export class ReceberComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;

  rows: any[] = [];
  produtos: any[] = [];

  form: FormGroup;
  pageTitle:string = "Comissões a receber";
  showTable:boolean = false;
  representadas:[] = [];

  timeout: any;
  SelectionType = SelectionType;
  selected = [];
  expandedAll = false;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
  ){
    this.clientservice.getRepresentadas().subscribe((res:any)=>{
      this.representadas = res.data
    })
  }    

  ngOnInit() {
    this.form = this.fb.group({
      tipo: ["Faturado"],
      dtInicio: [null],
      dtFinal: [null],
      nota: [null],
      representada: [null],
    });
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  toggleExpandRowAll(){
    if(this.expandedAll){
      this.expandedAll = false;
      this.table.rowDetail.collapseAllRows()
    }else{
      this.expandedAll = true;
      this.table.rowDetail.expandAllRows();
    }
  }

  onDetailToggle(event) {
    this.clientservice.getPedido(event.value.id).subscribe((res:any) =>{
      this.produtos = res.data.pedido_produtos
      console.log(this.produtos)
    })
  }

  clear(){
    this.form.reset();
    this.form.controls['tipo'].setValue("Faturado");
  }
  parcelas(data){
    let value;
    value = data.sort((a,b)=> a.id - b.id);
    return value;
  }

  selectNota(ev:any, data:any){
    if(ev.currentTarget.checked){
      data.nota_parcelas.forEach(e => {
        e.status_recebimento = true;
        e.data_recebimento = new Date();
      });
    }else{
      data.nota_parcelas.forEach(e => {
        e.status_recebimento = false;
        e.data_recebimento = "";
      });
    }
  }

  selectParcela(ev:any, row:any){
    if(ev.currentTarget.checked){
      row.status_recebimento = true;
      row.data_recebimento = new Date();
    }else{
      row.status_recebimento = false;
      row.data_recebimento = "";
    }
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  vencimento(row){
    let value = 0;
    row.nota_parcelas.forEach(element => {
      if(element.data_recebimento == null && value == 0){
        value = element.data_vencimento
      }
    });
    return value
  }
  checkRecebido = new Observable((observer) => {
    this.rows.forEach(e => {
      if(e.nota_parcelas.every(el => el.status_recebimento === true)){
        e.status = "recebido";
      }else{
        e.status = "aberto";
      }
    });
    observer.next(this.rows);
  })
  
  Submit(){
    this.clientservice.areceber(this.form.value).subscribe((res:any) => { 
      if(res.success == true){
        this.rows = res.data;
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }
      this.showTable = true;
    });
  }
}