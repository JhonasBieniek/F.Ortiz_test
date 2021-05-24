import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';
import page from '../novo/steps.json'
import { DialogRelatoriosPrintComponent } from './dialog-relatorios-print/dialog-relatorios-print.component';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  public form: FormGroup;
  data: any = [];
  dados: any = [];
  editing = {};
  isEditable = {};
  page: any = page;
  defaultTab = 0;
  selected: any = [];
  steps: any = this.page.homologacoes;
  rows = [];
  temp = [...this.data];
  clienteBusca = new FormControl("");
  clientes: any = [];
  $clientes: any = [];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  @ViewChild(RelatoriosComponent, { static: false }) table: RelatoriosComponent;
  constructor(private clientservice: ClientService, private fb: FormBuilder, private notificationService: NotificationService, private dialog: MatDialog) {
    //this.loadData();

    this.clientservice.getClientes().subscribe((res: any) => {
      this.clientes = res.data;
    });
  }

  searchCliente() {
    let $cliente: Observable<any[]>;
    let nome = this.clienteBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$clientes = this.clientes.filter(function (d) {
        if (
          d.razao_social.toLowerCase().match(re) ||
          d.cnpj.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$clientes = $cliente;
    }
  }

  setCliente(cliente) {
    console.log(cliente);
    this.form.get("cliente_id").setValue(cliente.id);
  }

  ngOnInit() {
    this.form = this.fb.group({
      cliente_id: [null],
      data_inicial: [null, Validators.required],
      data_final: [null, Validators.required],
      status: [null],
      hideRequired: true,
      floatLabel: "auto",
    });
  }

  private loadData() {
    this.clientservice.getHomologacoes().subscribe((res: any) => {
      this.rows = res.data;
      console.log(res.data);
    });
  }

  limpar(){
    this.form.get('cliente_id').setValue(null);
    this.clienteBusca.setValue('');
    this.$clientes = [];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.nome.toLowerCase().indexOf(val) !== -1 || !val
        || d.regio.nome.toLowerCase().indexOf(val) !== -1 || !val
        || d.vendedor.nome.toLowerCase().indexOf(val) !== -1 || !val)
        return d
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.data;
  }

  buscar(){
    console.log(this.form.value);
    if(this.form.get("data_inicial").value != null && this.form.get("data_final").value != null){
      this.clientservice.getHomologacoesRelatorio(this.form.value).subscribe((res: any) => {
        this.rows = res.data;
        //console.log(res);
      });
    }else{
      this.notificationService.notify("Informar a Data Iniciar e Final!");
    }
  }

  Imprimir(){
    if(this.rows.length > 0){
      let dialogConfig = new MatDialogConfig();
      dialogConfig = {
        maxWidth: '90vw',
        maxHeight: '90vh',
      }
      dialogConfig.data = [];
      dialogConfig.data.inicial = this.form.get("data_inicial").value;
      dialogConfig.data.final = this.form.get("data_final").value;
      dialogConfig.data.homologacoes = this.rows;
      //dialogConfig.data = this.dados.data;
      let dialogRef = this.dialog.open(
        DialogRelatoriosPrintComponent,
        dialogConfig,
      );
    }else {
      this.notificationService.notify("Não possui dados para impressão");
    }
  }

  /*openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '90vw',
      height: '70vh'
    }
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(
      DialogBodyComponent,
      dialogConfig,

    );
    dialogRef.afterClosed().subscribe(value => {
      this.refreshTable();
      console.log(`Dialog sent: ${value}`);
    });
  }*/

  refreshTable() {
    this.loadData();
  }
  delete(row) {
    /*const dialogConfig = new MatDialogConfig();
    const tipo = 'homologations';
    dialogConfig.data = row
    dialogConfig.data.tipo = tipo
    let dialogRef = this.dialog.open(DialogConfirmarDeleteComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });*/
  }
  edit(row) {
    /*let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '75vw',
      maxHeight: '85vh',
      width: '75vw',
      height: '75vh'
    }
    dialogConfig.data = row
    dialogConfig.data.action = 'edit'
    let dialogRef = this.dialog.open(DialogBodyComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(value => {

      (value != 1) ? this.refreshTable() : null

    });*/
  }

}
