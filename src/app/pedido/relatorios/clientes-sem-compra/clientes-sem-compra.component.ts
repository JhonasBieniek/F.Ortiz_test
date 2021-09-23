import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-clientes-sem-compra',
  templateUrl: './clientes-sem-compra.component.html',
  styleUrls: ['./clientes-sem-compra.component.css']


})
export class ClientesSemCompraComponent implements OnInit {

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
  ) {
    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data;
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      representada_id: [null],
      area_id: [null],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      ordenacao: ["codigo", Validators.required],
      tipo: ["asc", Validators.required],
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
    console.log(this.form.value);
  }

  limpar() {
    this.form.get('area_id').setValue(null);
    this.areas.setValue('');
    this.$areas = [];
  }
}