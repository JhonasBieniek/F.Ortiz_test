import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

@Component({
  selector: 'app-repasses',
  templateUrl: './repasses.component.html',
  styleUrls: ['./repasses.component.css']
})
export class RepassesComponent implements OnInit {

  form: FormGroup;
  pageTitle:string = "Repasses de comissões";
  showTable:boolean = false;
  representadas:[] = [];
  vendedores:[] = [];
  assistentes:[] = [];


  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
  ){
    this.clientservice.getRepresentadas().subscribe((res:any)=>{
      this.representadas = res.data
    });
    this.clientservice.getFuncionarios().subscribe((res:any)=>{
      this.vendedores = res.data.filter(
        vendedor => vendedor.cargo_id == 1);
        this.assistentes = res.data.filter(
          assistente => assistente.cargo_id == 4);
    });
  }    

  ngOnInit() {
    this.form = this.fb.group({
      tipo: ["Faturado"],
      dtInicio: [null],
      dtFinal: [null],
      nota: [null],
      select: [null],
      selected: [null]
    });
  }

  clear(){
    this.form.reset();
    this.form.controls['tipo'].setValue("Faturado");
  }
  
  Submit(){
    // this.clientservice.consulta(this.form).subscribe((res:any) => {


    //Pensar se notifica, caso não conseguir consultar
    //   if(res.success == true){
    //     this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
    //   }else{
    //     this.notificationService.notify(`Erro contate o Administrador`)
    //   }
    // });
  }
}