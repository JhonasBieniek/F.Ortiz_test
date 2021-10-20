import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']


})
export class PedidosComponent implements OnInit {

  
  form: FormGroup;
  ramos: any = [];
  representadas: any = [];
  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
    this.clientservice.getRamos().subscribe((res:any) =>{
      this.ramos = res.data;
    });

    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data;
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      status: ["todos", Validators.required],
      representada_id: [null],
      ramo_id: [null],
      periodo_inicial: [null, Validators.required],
      periodo_final: [null],
      entrega_inicial: [null],
      entrega_final: [null],
      tipo_cliente: ["todos", Validators.required],
      ordenacao: ["data", Validators.required],
      tipo: ["asc", Validators.required],
    });

  }

  submit(){
    console.log(this.form.value);
    this.clientservice.pedidosRelatorio(this.form.value).subscribe((res:any) =>{
    console.log(res)
    });
  }

  clear(){
    this.form = this.fb.group({
      status: ["todos", Validators.required],
      representada_id: [null],
      ramo_id: [null],
      periodo_inicial: [null, Validators.required],
      periodo_final: [null],
      entrega_inicial: [null],
      entrega_final: [null],
      tipo_cliente: ["todos", Validators.required],
      ordenacao: ["data", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }
}