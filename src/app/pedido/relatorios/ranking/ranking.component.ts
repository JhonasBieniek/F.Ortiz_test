import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogRankingPrintComponent } from './dialog-ranking-print/dialog-ranking-print.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']


})
export class RankingComponent implements OnInit {

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
      // agrupamento: ["nao_agrupado", Validators.required],
      representada_id: [null],
      area_id: [null],
      dtInicio: [null],
      dtFinal: [null],
      minimo: [null],
      maximo: [null],
      ordenacao: ["valor"],
      tipo: ["asc"],
      programado: [false]
    });
  }

  getAreas(representada_id){
    this.clientservice.getAreaByRepresentada(representada_id).subscribe((res:any) =>{
      this.areas = res.data;
      console.log(this.areas)
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
    this.form.get("area_id").setValue(area.id);
  }

  submit() {
    if(this.form.valid){
      this.clientservice.rankingPedidos(this.form.value).subscribe((res: any) => {
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

  print(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    dialogConfig.data = data;
    dialogConfig.data.form = this.form.value;
    let dialogRef = this.dialog.open(
      DialogRankingPrintComponent,
      dialogConfig
    );
  }

  limpar() {
    this.form = this.fb.group({
      status: ["todos", Validators.required],
      // agrupamento: ["nao_agrupado", Validators.required],
      representada_id: [null],
      area_id: [null],
      dtInicio: [null],
      dtFinal: [null],
      minimo: [null],
      maximo: [null],
      ordenacao: ["valor"],
      tipo: ["asc"],
      programado: [false]
    });
  }
}