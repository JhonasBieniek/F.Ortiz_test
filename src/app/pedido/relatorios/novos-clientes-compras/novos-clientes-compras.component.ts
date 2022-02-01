import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogNovosClientesPrintComponent } from './dialog-novos-clientes-print/dialog-novos-clientes-print.component';

@Component({
  selector: 'app-novos-clientes-compras',
  templateUrl: './novos-clientes-compras.component.html',
  styleUrls: ['./novos-clientes-compras.component.css']
})
export class NovosClientesComprasComponent implements OnInit {

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
      representada_id: [null],
      area_venda_id: [null],
      periodo: ["30"],
      outro: [null],
      ordenacao: ["nome", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

  getAreas(representada_id){
    this.$areas = [];
    this.areaBusca.setValue('');
    this.form.get('area_venda_id').setValue(null);
    this.clientservice.getAreaByRepresentada(representada_id).subscribe((res:any) =>{
      this.areas = res.data;
    });
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

  submit() {
    if(this.form.valid){
      if(this.form.get('periodo').value == "outro" && (this.form.get('outro').value == null || this.form.get('outro').value == '')){
        this.notificationService.notify("Quantidade de dias não informado!");
      }else{
        this.clientservice.relatorioNovosClientesCompras(this.form.value).subscribe((res: any) => {
          if(res.success == true){
            if(res.data.length > 0 ){
              if(this.form.get('representada_id').value == null){
                this.print(res.data)
              }else if(this.form.get('area_venda_id').value != null){
                let data: any[] = [];
                res.data.map( cliente => {
                  cliente.cliente_representada_area_vendas.map( area => {
                    if(area.area_venda_id == this.form.get('area_venda_id').value) data.push(cliente);
                  });
                });
                this.print(data)
              }else{
                let data: any[] = [];
                res.data.map( cliente => {
                  cliente.cliente_representada_area_vendas.map( area => {
                    if(area.AreaVendas.representada_id == this.form.get('representada_id').value) data.push(cliente);
                  });
                });
                this.print(data)
              }
            }else{
              this.notificationService.notify("Não foi localizado nenhum cliente!");
            }
          }
        });
      }
    }else{
      this.form.markAllAsTouched();
    }
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
      DialogNovosClientesPrintComponent,
      dialogConfig
    );
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null],
      area_venda_id: [null],
      periodo: ["30"],
      outro: [null],
      ordenacao: ["nome", Validators.required],
      tipo: ["asc", Validators.required],
    });
    this.areaBusca.setValue('');
    this.$areas = [];
  }

  limparArea() {
    this.$areas = [];
    this.areaBusca.setValue('');
    this.form.get('area_venda_id').setValue(null);
  }
}