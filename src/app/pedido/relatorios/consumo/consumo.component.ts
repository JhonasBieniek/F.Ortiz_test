import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';
import { DialogConsumoPrintComponent } from './dialog-consumo-print/dialog-consumo-print.component';

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
    private dialog: MatDialog
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
      representada_id: [null, Validators.required],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      codigo: ["produto", Validators.required],
      ordenacao: ["nome", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

  submit() {
    if(this.form.valid){
      this.clientservice.consumo(this.form.value).subscribe((res: any) => {
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
      DialogConsumoPrintComponent,
      dialogConfig
    );
  }

  clear() {
    this.form = this.fb.group({
      representada_id: [null],
      dtInicio: [null, Validators.required],
      dtFinal: [null, Validators.required],
      codigo: ["produto", Validators.required],
      ordenacao: ["nome", Validators.required],
      tipo: ["asc", Validators.required],
    });
  }

}
