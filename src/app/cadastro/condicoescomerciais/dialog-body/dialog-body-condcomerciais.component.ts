import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body-condcomerciais',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyCondComerciaisComponent implements OnInit {

  public form: FormGroup;
  dados:any= "";
  pageTitle:string = "";
  result = []
  condicoesComerciais = [{id:1, nome: "À vista"}, {id:2, nome: "À prazo"}, {id:3, nome: "Parcelado"},]
  

  constructor(public dialogRef: MatDialogRef<DialogBodyCondComerciaisComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private clientservice: ClientService,
                                private notificationService: NotificationService
                                ){}
                              
  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      prazo: [null, Validators.compose([Validators.required ])],
      parcelas: [null, Validators.compose([Validators.required ])],
      cond_id: [null],
      parcelas_qtd: this.fb.array([]),
    });
    if(this.data == null){
      this.pageTitle = 'Cadastrar Condição Comercial'
    }else{
      this.pageTitle = 'Editar Condição Comercial'
      this.chargeForm();
    }
  }

  private chargeForm(){
    this.form.patchValue(this.data)
  }

  itens() {
    return this.result
  }

  addParcela() {

    //Pegar o tamanho do form array ao inves de usar função itens
    let campos = this.form.controls.parcelas_qtd as FormArray;
    for(let i = 0; i < this.form.value.parcelas; i++){
      campos.push(this.fb.group({
        parcela: new FormControl('', Validators.required),
      }));
      this.itens().push(1)
    }
  }

  regioesSubmit() {
    if(this.data != undefined){
      this.clientservice.updateCondComerciais(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addCondComerciais(this.form.value)  
    }
  }

  close() {
    this.dialogRef.close();
  }

}
