import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-produtos-vendidos',
  templateUrl: './produtos-vendidos.component.html',
  styleUrls: ['./produtos-vendidos.component.css']

  
})
export class ProdutosVendidosComponent implements OnInit {

    form: FormGroup;
    vendedor_id = new FormControl(null);
    auxiliar_id = new FormControl(null);
    cliente_id = new FormControl(null);
    tipo = new FormControl(null);

    constructor(
      private fb: FormBuilder,
      private clientservice: ClientService,
      private notificationService: NotificationService,
      private route: ActivatedRoute,
    ){

}
  ngOnInit(): void {
    this.form = this.fb.group({
      dtInicio: [null],
      dtFinal: [null],
      representada_id: [null],
      tipo: ['faturamento'],
      campo_ordem: null,
      tipo_ordem: null,
      tipo_data: null,
      num_nota: null,

    });
  }
}