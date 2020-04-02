import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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
  pageTitle:string = "";

  constructor(public dialogRef: MatDialogRef<DialogBodyProdutoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder, 
              private clientservice: ClientService,
              private notificationService: NotificationService) 
   { 
    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data;
    }); 
    this.clientservice.getUnidades().subscribe((res:any) =>{
      this.unidades = res.data;
    });
   }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      ipi: [null,],
      certificado_aprovacao: [null],
      codigo: [null],
      embalagem: [null],
      representada_id: [null, Validators.compose([Validators.required])],
      unidade_id: [null],
      status: [true],
    });
    if(this.data == null){
      this.pageTitle = 'Cadastrar Produto'
    }else{
      this.pageTitle = 'Editar Produto'
      this.form.patchValue(this.data);
    }
  }
  close() {
    this.dialogRef.close(
    );
  }

  onSubmit(){
      if(this.data == null){
      this.clientservice.addProdutos(this.form.value).subscribe((res:any) =>{
        if(res.success == true){
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
          this.close();
        }else{
          this.notificationService.notify(`Erro contate o Administrador`)
        }}
      );
     }else{
      this.clientservice.updateProduto(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
        this.close();
      })
     }
  }
}
