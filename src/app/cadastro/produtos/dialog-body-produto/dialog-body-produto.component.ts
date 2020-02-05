import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors} from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-dialog-body-produto',
  templateUrl: './dialog-body-produto.component.html',
  styleUrls: ['./dialog-body-produto.component.css']
})

export class DialogBodyProdutoComponent implements OnInit {
  public form: FormGroup;
  representadas = [];
  unidades = [];
  constructor(
    public dialogRef: MatDialogRef<DialogBodyProdutoComponent>,
    private fb: FormBuilder, 
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) { 
    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data;
    }); 
    this.clientservice.getUnidades().subscribe((res:any) =>{
      this.unidades = res.data;
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
      status: [1]
    });
  }

  onSubmit(){
    this.clientservice.addProdutos(this.form.value).subscribe((res:any) =>{
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
        this.dialogRef.close();
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }}
    );
  }
}
