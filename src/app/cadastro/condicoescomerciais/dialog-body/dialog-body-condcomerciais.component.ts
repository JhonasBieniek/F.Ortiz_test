import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-dialog-body-condcomerciais',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyCondComerciaisComponent implements OnInit {

  public form: FormGroup;
  dados: any = "";
  pageTitle: string = "";
  result = []
  condicoesComerciais = [{ id: "vista", nome: "À vista" }, { id: "prazo", nome: "À prazo" }, { id: "parcelado", nome: "Parcelado" },]
  readonly = false;


  constructor(public dialogRef: MatDialogRef<DialogBodyCondComerciaisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) {
    console.log(data, "data");
    if (data != null) {
      this.clientservice.viewCondComerciais(data.id).subscribe((res: any) => {
        this.dados = res.data;
        this.chargeForm();
        this.addParcela("edit");
        this.chargeForm();
      })
    }

  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      dias: [null],
      parcelas_qtd: [null],
      tipo: [null],
      parcelas: this.fb.array([]),
    });
    if (this.data == null) {
      this.pageTitle = 'Cadastrar Condição Comercial'
    } else {
      if(this.data.action == "edit"){
        this.pageTitle = 'Editar Condição Comercial';
      }else{
        this.pageTitle = 'Visualizar Condição Comercial';
        this.readonly = true;
      }
    }
  }

  validaDias(data) {
    this.form.controls['parcelas_qtd'].setValue(null);
    this.form.controls['dias'].setValue(0);
    this.addParcela('new');
    if (data == 'prazo') {
      this.form.controls.dias.setValidators(Validators.required);
      this.form.get('parcelas_qtd').clearValidators();
      this.form.get('parcelas_qtd').updateValueAndValidity();
    } else if (data == 'parcelado') {
      this.form.controls.parcelas_qtd.setValidators(Validators.required);
      this.form.get('dias').clearValidators();
      this.form.get('dias').updateValueAndValidity();
    } else {
      this.form.get('parcelas_qtd').clearValidators();
      this.form.get('parcelas_qtd').updateValueAndValidity();
      this.form.get('dias').clearValidators();
      this.form.get('dias').updateValueAndValidity();
    }
  }

  private chargeForm() {
    this.form.patchValue(this.dados)
  }

  parcelas(): FormArray {
    return this.form.get("parcelas") as FormArray
  }
  novaParcela(): FormGroup {
    return this.fb.group({
      parcela: [null, Validators.compose([Validators.required, CustomValidators.number('IN')])],
    })
  }
  addParcela(action) {

    if (action == 'new') {
      while (this.parcelas().length) {
        this.parcelas().removeAt(this.parcelas().length - 1)
      }
    }

    for (let i = 0; i < this.form.value.parcelas_qtd; i++) {
      this.parcelas().push(this.novaParcela());
    }
  }

  Submit() {
    if (this.data != undefined) {
      this.clientservice.updateCondComerciais(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    } else {
      this.clientservice.addCondComerciais(this.form.value)
    }
  }

  close() {
    this.dialogRef.close();
  }

}
