import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recebimentos',
  templateUrl: './recebimentos.component.html',
  styleUrls: ['./recebimentos.component.css']
})
export class RecebimentosComponent implements OnInit {
  
  @ViewChild('myTable', { static: false }) table: any;
  @ViewChildren('Parcela') parcela: QueryList<ElementRef>;

  rows: any[] = [];
  timeout: any;
  SelectionType = SelectionType;
  selected = [];
  expandedAll = false;
  form: FormGroup;
  pageTitle:string = "Receber Comissões";
  showTable:boolean = false;
  representadas:[] = [];

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
    this.formInit();
  }

  formInit(){
    this.form = this.fb.group({
      tipo: ["Recebimentos"],
      campo_ordem: ['Data'],
      tipo_ordem: ['ASC'],
      tipo_data: ['faturamento'],
      dtInicio: [null],
      dtFinal: [null],
      num_nota: [null],
      representada_id: [null],
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
  }

  clear(){
    this.form.reset();
    this.form.controls['tipo'].setValue("Faturado");
    this.showTable = false;
    this.formInit();
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
        e.data_recebimento = null;
      });
    }
  }

  selectParcela(ev:any, row:any){
    if(ev.currentTarget.checked){
      row.status_recebimento = true;
      row.data_recebimento = new Date();
    }else{
      row.status_recebimento = false;
      row.data_recebimento = null;
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
    if(value == 0){
      if(row.nota_parcelas.length > 0) value = row.nota_parcelas[row.nota_parcelas.length-1].data_vencimento;
    }
    return value
  }
  
  submit(){
    this.clientservice.getRecebimentos(this.form.value).subscribe((res:any) => {
      this.rows = res.data;
      this.showTable = true;
    });

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

  sendBaixa(){
    this.checkRecebido.subscribe((res:any) => {
      this.clientservice.baixaRecebimentos(res).subscribe((res:any) => {
        if(res.success ==  true){
          this.rows = [];
          this.submit();
          this.notificationService.notify("Parcelas Recebidas com sucesso !");
        }
      })
    });
  }
}