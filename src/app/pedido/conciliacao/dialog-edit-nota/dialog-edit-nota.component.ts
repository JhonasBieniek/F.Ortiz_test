import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ClientService } from '../../../shared/services/client.service.component';
import { NovoComponent } from '../../pedido-listar/novo/novo.component';

@Component({
  selector: 'app-dialog-edit-nota',
  templateUrl: './dialog-edit-nota.component.html',
  styleUrls: ['./dialog-edit-nota.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DialogEditNotaComponent implements OnInit {

  public form: FormGroup;
  dados;
  pedido;
  editing = {};
  rows:any = [];
  temp:any = [];
  selected:any = [];
  nota_parcelas:any = [];
  steps: any = [
    {
      titulo: "Produtos do Pedido",
      step: true,
      index: 0
    }
  ];

  defaultTab = 0;

  itemSelected

  loadingIndicator = true;
  reorderable = true;

  isEditable = {};   
  
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogEditNotaComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.loadData();
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      pedido_id: [null],
      num_nota: [null, Validators.compose([Validators.required])],
      data_faturamento: [null, Validators.compose([Validators.required, CustomValidators.date])],
      obs: [null],
      status: ["aberto"],
      nota_parcelas: this.fb.array([])
    });
    this.nota_parcelas = this.form.get('nota_parcelas') as FormArray;
  }

  loadData(){
    this.clientservice.getNotasID(this.data.id).subscribe((res:any) =>{
      this.form.patchValue(res.data);
      this.pedido = res.data.pedido;
      this.temp = this.pedido.pedido_produtos.sort((a,b)=> a.id - b.id);
      this.rows = [...this.temp];
    });
  }

  criaParcelas(){
    this.clearParcelas();
    let data = new Date(this.form.get('data_faturamento').value);
    if(this.pedido.condicao_comercial.dias != null){
      let parcelas = this.pedido.condicao_comercial.dias.split("/");
      let valor = this.pedido.valor_total / parcelas.length;
      for(let i=0; i<parcelas.length; i++){
        if(parcelas[i] != ""){
          let vencimento = new Date(data)
          this.nota_parcelas.push(this.fb.group({
            data_vencimento: new Date (vencimento.setDate(vencimento.getDate() + parseInt(parcelas[i]))),
            valor: valor,
            status_recebimento: false,
            parcela: i
          }))
        }
      }
    }
  }

  clearParcelas(){
    while (this.nota_parcelas.controls.length) {
      this.nota_parcelas.removeAt(0);
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(d => {
      if( d.produto.codigo.toLowerCase().indexOf(val) !== -1 || !val 
      || d.produto.nome.toLowerCase().indexOf(val) !== -1 || !val)
      return d
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(row){
    console.log(row);
  }

  async save() {
    await this.criaParcelas();
    console.log(this.form.value);
    this.clientservice.editNota(this.form.value).subscribe((res:any) => {
      this.dialogRef.close(res.success);
    });
  }

  edit(row){
    let dialogConfig = new MatDialogConfig()
    dialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',
    
      width: '95vw',
      height: '95vh'
    }
    dialogConfig.data = {
      tipo: 'edit',
      pedido: row
    }
    let dialogRef = this.dialog.open(NovoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
      this.loadData();
    })
  }

}
