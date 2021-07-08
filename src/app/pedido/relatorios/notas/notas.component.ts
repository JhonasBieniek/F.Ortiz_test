import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']


})
export class NotasComponent implements OnInit {

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
      status: [null, Validators.required],
      observacao: [false],
      representada_id: [null, Validators.required],
      ramo_id: [null, Validators.required],
      periodo_inicial: [null, Validators.required],
      periodo_final: [null, Validators.required],
      entrega_inicial: [null, Validators.required],
      entrega_final: [null, Validators.required],
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