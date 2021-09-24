import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent implements OnInit {

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
      representada_id: [null],
      mesInicio: [null, Validators.required],
      anoInicio: [null, Validators.required],
      mesFim: [null, Validators.required],
      anoFim: [null, Validators.required],
      codigo: ["produto", Validators.required],
      ordenacao: ["nome", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

  submit() {
    console.log(this.form.value);
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null],
      mesInicio: [null, Validators.required],
      anoInicio: [null, Validators.required],
      mesFim: [null, Validators.required],
      anoFim: [null, Validators.required],
      codigo: [null, Validators.required],
      ordenacao: ["codigo", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

}
