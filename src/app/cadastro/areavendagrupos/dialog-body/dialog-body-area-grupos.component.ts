import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormArray } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-body-area-grupos',
  templateUrl: './dialog-body-area-grupos.component.html',
  styleUrls: ['./dialog-body-area-grupos.component.css']
})
export class DialogBodyAreaGruposComponent implements OnInit {

  public form: FormGroup;
  areasVenda = [];
  pageTitle:string = "";
  readonly = false;


  constructor(public dialogRef: MatDialogRef<DialogBodyAreaGruposComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any,
                                private fb: FormBuilder,
                                private notificationService: NotificationService,
                                private clientservice: ClientService
                                )
    {
      this.clientservice.getAreaVenda().subscribe((res:any) =>{
        this.areasVenda = res.data; 
      }); 

      this.form = this.fb.group({
        id: null,
        name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        description: [null, Validators.compose([Validators.required])],
        area_venda_grupo_area_vendas: this.fb.array([]),
        status: [true, Validators.required],
        hideRequired: true,
        floatLabel: 'auto',
      });
  }
                              
  ngOnInit() {
    if(this.data != null){
      if(this.data.action =="edit"){
        this.pageTitle = 'Editar grupo de áreas de venda';
        this.addAreaVendas(this.data.area_venda_grupo_area_vendas);
        console.log(this.form)
        this.form.patchValue(this.data);

      }else{
        this.pageTitle = 'Visualizar grupo de áreas de venda';
        this.addAreaVendas(this.data.area_venda_grupo_area_vendas);

        this.readonly = true;
      }
    }else{
      this.pageTitle = 'Cadastrar área de venda'

    }
  }

  delAreaVenda(index) {
    const area_venda = this.form.controls.area_venda_grupo_area_vendas as FormArray;
    area_venda.removeAt(index);
  }

  addAreaVenda(data: any = null) {
    const area_venda = this.form.controls.area_venda_grupo_area_vendas as FormArray;
    area_venda.push(
      this.fb.group({
        area_venda_id: data ? data.area_venda_id : null,
        area_venda_grupo_id: data ? data.area_venda_grupo_id : null,
      })
    );
  }


  addAreaVendaEdit(data: any = null) {
    const area_venda = this.form.controls.area_venda_grupo_area_vendas as FormArray;
    area_venda.push(
      this.fb.group({
        id: data ? data.id : null,
        area_venda_id: data ? data.area_venda_id : null,
        area_venda_grupo_id: data ? data.area_venda_grupo_id : null,
      })
    );
  }

  addAreaVendas(data: any) {
    data.forEach(async (e: any) => {
      if (this.data.action == 'edit' || this.data.action == 'view') {
        this.addAreaVendaEdit(e);
      } else {
        this.addAreaVenda(e);
      }
    });
  }

  areaVendasSubmit() { 
    if(this.data != undefined){
      this.clientservice.updateAreaVendasGrupo(this.form.value).subscribe( () =>{
        this.notificationService.notify("Atualizado com Sucesso!")
      })
    }else{
      this.clientservice.addAreaVendasGrupo(this.form.value)  
    }
  }

  close() {
    this.dialogRef.close(
    );
  }

  getFormValidationErrors() {
    const result = [];
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });
  }

}
