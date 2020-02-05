import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';

export interface representada {
  razao_social: string;
  id: string;
}

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss']
})
export class NovoComponent implements OnInit {
  public form: FormGroup;
  public form2: FormGroup;
  data: any;
  dados: any;
  dataUnidades: any;
  representadas: representada[] = [];
  unidades = [];
  selectedRepresentada: string;
  selectedUnidade: string;

  constructor(private fb: FormBuilder, 
              private clientservice: ClientService,
              private notificationService: NotificationService) {

    this.clientservice.getRepresentadas().subscribe(res =>{
      this.data = res;
      this.representadas = this.data.data; 
    }); 

    this.clientservice.getUnidades().subscribe(res =>{
      this.dataUnidades = res;
      this.unidades = this.dataUnidades.data; 
    });
       }
     
     ngOnInit() {
       this.form = this.fb.group({
         nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
         ipi: [null, Validators.compose([Validators.minLength(1), Validators.maxLength(3)])],
         certificado_aprovacao: [null],
         codigo: [null],
         embalagem: [null],
         representada_id: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
         unidade_id: [null],
         status: [null, Validators.required]
       });
     }

     onSubmit(){
      this.dados = [{
        nome : this.form.value.nome,
        ipi: this.form.value.ipi,
        certificado_aprovacao: this.form.value.certificadoAprovacao,
        codigo: this.form.value.codigo,
        embalagem: this.form.value.embalagem,
        representada_id: this.selectedRepresentada,
        unidade_id: this.selectedUnidade,
        status:this.form.value.status,
      }]
      this.clientservice.addProdutos(this.dados)
 
     }
     hide = true;
   }
