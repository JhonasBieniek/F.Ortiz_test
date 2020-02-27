import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../pedido/novo/novo.component';

@Component({
  selector: 'app-receber',
  templateUrl: './receber.component.html',
  styleUrls: ['./receber.component.css'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class ReceberComponent implements OnInit {

  funcionario: FormGroup;
  usuario: FormGroup;
  isLinear: boolean = false;
  pageTitle:string = "Comissões a receber";
  currentAction:string ="";
  showTable:boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private datePipe : DatePipe,
  ){}    

  ngOnInit() {
    this.funcionario = this.fb.group({
      tipo: ["Faturado"],
      dtInicio: [null],
      dtFinal: [null],
      nota: [null],
      representada: [null],
    });
  }

  clear(){

  }
  
  Submit(){
    let data = this.funcionario.value;
    data.nascimento = this.datePipe.transform(data.nascimento, 'yyyy-MM-dd');
    this.clientservice.addFuncionario(data).subscribe((res:any) => {
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    });
  }
}