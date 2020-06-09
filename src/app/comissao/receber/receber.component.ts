import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

@Component({
  selector: 'app-receber',
  templateUrl: './receber.component.html',
  styleUrls: ['./receber.component.css']
})
export class ReceberComponent implements OnInit {

  form: FormGroup;
  pageTitle:string = "Comissões a receber";
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
      tipo: ["Faturado"],
      dtInicio: [null],
      dtFinal: [null],
      nota: [null],
      representada: [null],
    });
  }

  clear(){
    this.form.reset();
    this.form.controls['tipo'].setValue("Faturado");
  }
  
  Submit(){
    this.clientservice.areceber(this.form.value).subscribe((res:any) => { 
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    });
  }
}