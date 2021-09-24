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
      representada_id: [null, Validators.required],
      status: ["todos"],
      observacao: [false],
      dtInicio: [null, Validators.required],
      dtFim: [null, Validators.required],
      ordenacao: ["valor"],
      tipo_ordenacao: ["asc"],
    });

  }

  submit() {
    console.log(this.form.value);
  }

  clear() {

  }
}