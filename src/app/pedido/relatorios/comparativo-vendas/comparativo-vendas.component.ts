import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogComparativoPrintComponent } from './dialog-comparativo-print/dialog-comparativo-print.component';

@Component({
  selector: 'app-comparativo-vendas',
  templateUrl: './comparativo-vendas.component.html',
  styleUrls: ['./comparativo-vendas.component.css']


})
export class ComparativoVendasComponent implements OnInit {

  form: FormGroup;
  areaBusca = new FormControl("");
  areas: any = [];
  $areas: any = [];
  representadas: any = [];

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data;
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      status: ["todos", Validators.required],
      representada_id: [null],
      area_venda_id: [null],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
    });
  }

  getAreas(representada_id){
    this.clientservice.getAreaByRepresentada(representada_id).subscribe((res:any) =>{
      this.areas = res.data;
    });
  }

  searchArea() {
    let $area: Observable<any[]>;
    let nome = this.areaBusca.value;
    console.log(nome)
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

  submit() {
    if(this.form.valid){
      this.clientservice.RelatorioComparativoVendas(this.form.value).subscribe((res: any) => {
        console.log(res)
        if(res.success == true){
          if(res.data.length > 0 ){
            this.print(res.data)
          }else{
            this.notificationService.notify("Não foi localizado nenhum pedido!");
          }
        }
      });
    }else{
      this.form.markAllAsTouched();
    }
  }

  limparArea() {
    this.form.get('area_venda_id').setValue(null);
    this.$areas = [];
    this.areaBusca.setValue('');
  }

  clear() {
    this.form = this.fb.group({
      status: ["todos", Validators.required],
      representada_id: [null],
      area_venda_id: [null],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
    });
    this.areaBusca.setValue('');
    this.$areas = [];
  }

  print(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    dialogConfig.data = data;
    dialogConfig.data.form = this.form.value;
    let dialogRef = this.dialog.open(
      DialogComparativoPrintComponent,
      dialogConfig
    );
  }
}