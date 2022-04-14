import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogClientesPrintComponent } from './dialog-clientes-print/dialog-clientes-print.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [TitleCasePipe]
})
export class ClientesComponent implements OnInit {

  form: FormGroup;
  ramos: any = [];
  representadas: any = [];

  areaBusca = new FormControl("");
  allareas: any[];
  areas: any = [];
  $areas: any = [];

  //

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private titlecase: TitleCasePipe
  ) {

    this.clientservice.getRamos().subscribe((res: any) => {
      this.ramos = res.data;
    });

    this.clientservice.getRepresentadas().subscribe((res: any) => {
      this.representadas = res.data;
    });

    this.clientservice.getAreaVenda().subscribe((res: any) => {
      this.areas = res.data;
      this.allareas = res.data;
      this.$areas = res.data;
    });
    
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      representada_id: [null],
      area_venda_id: [null],
      cidade: [null],
      ramo_atividade_id: [null],
      ordenacao: ["cliente", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

  submit() {
    if(this.form.get('cidade').value){
      this.form.get('cidade').setValue( this.titlecase.transform(this.form.get('cidade').value));
    }
    this.clientservice.relatorioClientes(this.form.value).subscribe((res: any) => {
      if(res.success == true){
        if(res.data.length > 0 ){
          this.print(res.data)
        }else{
          this.notificationService.notify("Não foi localizado nenhum cliente!");
        }
      }
    });
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null],
      area_venda_id: [null],
      cidade: [null],
      ramo_atividade_id: [null],
      ordenacao: ["cliente", Validators.required],
      tipo: ["asc", Validators.required],
    });

    this.areaBusca.setValue('');
    this.$areas = this.allareas;
  }

  print(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    dialogConfig.data = {};
    dialogConfig.data.registros = data;
    dialogConfig.data.form = this.form.value;
    let dialogRef = this.dialog.open(
      DialogClientesPrintComponent,
      dialogConfig
    );
  }

  filterAreas(event:any){
    if(event.value != null){
      this.areas = this.allareas.filter(area => area.representada_id === event.value);
      this.$areas = this.areas;
    }else{
      this.areas = this.allareas;
      this.$areas = this.allareas;
    }

    this.areaBusca.setValue('');
    this.form.get('area_venda_id').setValue(null);
  }

  searchArea() {
    let $area: Observable<any[]>;
    let nome = this.areaBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$areas = this.areas.filter(function (d) {
        if (
          d.nome.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$areas = $area;
    }
  }

  setArea(area) {
    this.form.get("area_venda_id").setValue(area.id);
  }

  limparArea() {
    this.$areas = [];
    this.areaBusca.setValue('');
    this.form.get('area_venda_id').setValue(null);
  }
}
