import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

@Component({
  selector: 'app-recebimentos',
  templateUrl: './recebimentos.component.html',
  styleUrls: ['./recebimentos.component.css']
})
export class RecebimentosComponent implements OnInit {

  
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
      tipo_ordem: ['Crescente'],
      tipo_data: ['Faturamento'],
      dtInicio: [null],
      dtFinal: [null],
      num_nota: [null],
      representada_id: [null],
    });
  }

  clear(){
    this.form.reset();
    this.form.controls['tipo'].setValue("Faturado");
  }
  
  Submit(){
    this.clientservice.getRecebimentos(this.form.value).subscribe((res:any) => {
      console.log(res);
    //Pensar se notifica, caso não conseguir consultar
    //   if(res.success == true){
    //     this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
    //   }else{
    //     this.notificationService.notify(`Erro contate o Administrador`)
    //   }
    });
  }
}