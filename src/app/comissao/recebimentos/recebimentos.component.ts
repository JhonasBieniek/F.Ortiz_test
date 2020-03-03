import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

@Component({
  selector: 'app-recebimentos',
  templateUrl: './recebimentos.component.html',
  styleUrls: ['./recebimentos.component.css']
})
export class RecebimentosComponent implements OnInit {
  
  @ViewChild('myTable', { static: false }) table: any;

  rows: any[] = [];
  timeout: any;

  selected = [];

   
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
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
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
  selection(row:any){
    console.log(row, 'checked')
  }

  onCheckboxChangeFn(row:any){
    console.log(row.currentTarget.checked)
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
  
  submit(){
    this.clientservice.getRecebimentos(this.form.value).subscribe((res:any) => {
      console.log(res);
      this.rows = res.data;
      this.showTable = true;
    //Pensar se notifica, caso não conseguir consultar
    //   if(res.success == true){
    //     this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
    //   }else{
    //     this.notificationService.notify(`Erro contate o Administrador`)
    //   }
    });
  }
  sendBaixa(){
    this.clientservice.baixaRecebimentos(this.selected).subscribe((res:any) => {
      console.log(res);
    })
  }
}