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

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      representada_id: [null, Validators.required],
      ramo_id:[null, Validators.required],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      tipo_cliente: [null, Validators.required],
      ordenacao: [null, Validators.required],
    });
  }

  submit() {
    console.log(this.form.value);
  }

  clear() {

  }
}