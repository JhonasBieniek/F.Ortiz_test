import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import moment from 'moment';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';
import { ExcelExportService } from '../../shared/services/excel-export.service';
import { DialogAlterarComponent } from './dialog-alterar/dialog-alterar.component';
import { DialogConfirmarDeleteContasComponent } from './dialog-confirmar-delete-contas/dialog-confirmar-delete-contas.component';
import { DialogContasImprimirComponent } from './dialog-contas-imprimir/dialog-contas-imprimir.component';
import { DialogIncluirComponent } from './dialog-incluir/dialog-incluir.component';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class ContasComponent implements OnInit {

  rows: any[] = [];
  temp: any[] = [];
  public form: FormGroup;

  constructor(private clientservice: ClientService, private fb: FormBuilder, private notificationService: NotificationService, private dialog: MatDialog, private excelService: ExcelExportService) {
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      data_inicial: [null, Validators.required],
      data_final: [null, Validators.required],
      tipo: [null],
      status: [null],
      hideRequired: true,
      floatLabel: "auto",
    });
    this.atualizar();
  }

  atualizar(){
    this.clientservice.financeiroContas(this.form.value).subscribe((res: any) => {
      console.log(res)
      this.rows = res.data;
      this.temp = res.data;
    });
  }

  novaConta(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '700px',
    }

    // dialogConfig.data = [];
    // dialogConfig.data.unidade_id = this.form.controls['unidade_id'].value;
    let dialogRef = this.dialog.open(
      DialogIncluirComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(value => {
      setTimeout(() => { this.atualizar(); }, 250);
    });
  }

  // updateFilter(event) {
  //   const val = event.target.value.toLowerCase();
  //   const desired = val.replace(/[^\w\s]/gi, '')
  //   // filter our data
  //   const temp = this.temp.filter(function (d) {
  //     if(d.vendedor){
  //       if (d.vendedor.nome.toLowerCase().indexOf(val) !== -1
  //       || d.descritivo.toLowerCase().indexOf(val) !== -1
  //       || !val)
  //         return d
  //     }else if(d.auxiliar){
  //       if (d.auxiliar.nome.toLowerCase().indexOf(val) !== -1
  //       || d.descritivo.toLowerCase().indexOf(val) !== -1
  //       || !val)
  //         return d
  //     }else {
        
  //     }
  //   });
  //   // update the rows
  //   this.rows = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   //this.table = this.data;
    
  // }

  edit(row){
    console.log(row);

    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '700px',
    }

    dialogConfig.data = row;
    // dialogConfig.data.unidade_id = this.form.controls['unidade_id'].value;
    let dialogRef = this.dialog.open(
      DialogAlterarComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(value => {
      setTimeout(() => { this.atualizar(); }, 250);
    });
  }

  delete(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row;
    
    let dialogRef = this.dialog.open(DialogConfirmarDeleteContasComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {
      if(value){
        this.clientservice.deleteConta(row.id).subscribe((res: any) => {
          if(res.status){
            this.notificationService.notify("Deletado com Sucesso!");
          }else{
            this.notificationService.notify("Não foi possivel deletar informe ao administrador!");
            console.log(res.data);
          }
        });
      }
      this.atualizar()
    });
  }

  gerarExcel(){
    let contasExportacao: any[] = [];
    console.log(this.rows);
    this.rows.map( (e:any) => {
        let row = {
          id: e.id,
          tipo: e.tipo,
          num_nota: e.nota_id != null ? e.nota.num_nota : '',
          parcela: e.nota_parcela_id != null ? e.nota_parcela.parcela : '',
          representada: e.representada_id != null ? e.representada.nome_fantasia : '',
          descritivo: e.descritivo,
          valor: e.valor,
          data_pagamento: e.data_pagamento != null ? moment(e.data_pagamento).format("DD-MM-YYYY") : '',
          status: e.status_pagamento == true ? 'Pago' : 'Pendente',
          vendedor: e.vendedor_id != null ? e.vendedor.nome : '',
          auxiliar: e.auxiliar_id != null ? e.auxiliar.nome : '',
          operacao: e.operacao,
          observacao: e.obs,
        }
        contasExportacao.push(row);
    })
    this.excelService.exportToExcel(contasExportacao, 'Contas');
  }

  print() {

    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    dialogConfig.data = this.rows;
    let dialogRef = this.dialog.open(
      DialogContasImprimirComponent,
      dialogConfig
    );
  }
}
