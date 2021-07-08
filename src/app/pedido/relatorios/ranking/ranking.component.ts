import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']


})
export class RankingComponent implements OnInit {

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
      ramo_id: [null, Validators.required],
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