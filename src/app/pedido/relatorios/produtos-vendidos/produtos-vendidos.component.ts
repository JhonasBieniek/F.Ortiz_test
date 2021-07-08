import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

    constructor(
      private fb: FormBuilder,
      private clientservice: ClientService,
      private notificationService: NotificationService,
      private route: ActivatedRoute,
    ){

}
  ngOnInit(): void {
    this.form = this.fb.group({
      representada_id: [null, Validators.required],
      cliente_id: [null, Validators.required],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      codigo_id: [null, Validators.required],
      relatorio_id: [null, Validators.required],
      ordenacao: [null, Validators.required],
    });
  }

  submit(){
    console.log(this.form.value);
  }

  clear(){

  }
}