import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-comparativo-vendas',
  templateUrl: './comparativo-vendas.component.html',
  styleUrls: ['./comparativo-vendas.component.css']


})
export class ComparativoVendasComponent implements OnInit {

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
      representada_id: [null, Validators.required],
      area_id: [null, Validators.required],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
    });
  }

  submit() {
    console.log(this.form.value);
  }

  clear() {

  }
}