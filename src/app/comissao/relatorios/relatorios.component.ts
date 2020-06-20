import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;

  form: FormGroup;
  pageTitle:string = "Comissões a receber";
  showTable:boolean = false;
  resposta:[] = [];
  representadas:[] = [];
  areas:[] = [];
  funcionarios:[] = [];
  clientes:[] = [];
  rota:string
  show:boolean = true


  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ){
    this.rota = this.route.snapshot.url[1].path;
    if(this.rota == 'acumulado'){
      this.show = false
      this.getConsults('representadas');
      this.getConsults('areas');
    }
    if(this.rota == 'comissoes'){
      this.show = false
      this.getConsults('representadas');
      this.getConsults('areas');
      this.getConsults('funcionarios');
    }
    if(this.rota == 'recebimento' || this.rota == 'devolucoes' || this.rota == 'estorno'){
      this.getConsults('representadas');
      this.getConsults('areas');
      this.getConsults('clientes');
    }
  }  

  getConsults(consulta){
    if(consulta == 'representadas')
    this.clientservice.getRepresentadas().subscribe((res:any)=>{
      this.representadas = res.data;
    })
    else if(consulta == 'areas')
    this.clientservice.getAreaVenda().subscribe((res:any)=>{
      this.areas = res.data;
    })
    else if(consulta == 'funcionarios')
    this.clientservice.getFuncionarios().subscribe((res:any)=>{
      this.funcionarios = res.data;
    })
    else if(consulta == 'clientes')
    this.clientservice.getClientes().subscribe((res:any)=>{
      this.clientes = res.data;
    })
  }

  Clientes(area){
    return this.clientes.filter((e:any) =>
      e.area_venda_id == area
    )
     
  }
  ngOnInit() {
    this.form = this.fb.group({
      tipo: [null],
      dtInicio: [null],
      dtFinal: [null],
      nota: [null],
      representada: [null],
      area: [null],
      funcionario: [null],
      cliente: [null],
    });
  }

  clear(){
    this.form.reset();
  }
  
  Submit(){
    // this.clientservice.areceber(this.form.value).subscribe((res:any) => { 
    //   if(res.success == true){
    //     this.resposta = res.data;
    //   }else{
    //     this.notificationService.notify(`Erro contate o Administrador`)
    //   }
    // });
  }
}