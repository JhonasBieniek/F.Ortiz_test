import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogNotasPrintComponent } from './dialog-notas-print/dialog-notas-print.component';

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
    private dialog: MatDialog
  ) {
    this.clientservice.getRepresentadas().subscribe((res:any) =>{
      this.representadas = res.data;
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      representada_id: [null],
      status: ["todos"],
      obs: [false],
      data_inicial: [null],
      data_final: [null],
      ordenacao: ["valor"],
      tipo: ["asc"],
    });
  }

  submit() {
    if(this.form.valid){
      this.clientservice.relatorioNotas(this.form.value).subscribe((res: any) => {
        if(res.success == true){
          if(res.data.length > 0 ){
            this.print(res.data)
          }else{
            this.notificationService.notify("Não foi localizado nenhum pedido!");
          }
        }
      });
    }else{
      this.form.markAllAsTouched();
    }
  }

  print(data) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
    }
    dialogConfig.data = data;
    dialogConfig.data.form = this.form.value;
    let dialogRef = this.dialog.open(
      DialogNotasPrintComponent,
      dialogConfig
    );
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null, Validators.required],
      status: ["todos"],
      obs: [false],
      data_inicial: [null, Validators.required],
      data_final: [null, Validators.required],
      ordenacao: ["valor"],
      tipo_ordenacao: ["asc"],
    });
  }
}