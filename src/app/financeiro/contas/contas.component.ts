import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';
import { DialogAlterarComponent } from './dialog-alterar/dialog-alterar.component';
import { DialogIncluirComponent } from './dialog-incluir/dialog-incluir.component';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class ContasComponent implements OnInit {

  rows: any[] = [];
  temp: any[] = [];
  public form: FormGroup;

  constructor(private clientservice: ClientService, private fb: FormBuilder, private notificationService: NotificationService, private dialog: MatDialog) {
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      data_inicial: [null, Validators.required],
      data_final: [null, Validators.required],
      tipo: [null],
      status: [null],
      hideRequired: true,
      floatLabel: "auto",
    });
    this.atualizar();
  }

  atualizar(){
    this.clientservice.financeiroContas(this.form.value).subscribe((res: any) => {
      console.log(res)
      this.rows = res.data;
      this.temp = res.data;
    });
  }

  novaConta(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '700px',
    }

    // dialogConfig.data = [];
    // dialogConfig.data.unidade_id = this.form.controls['unidade_id'].value;
    let dialogRef = this.dialog.open(
      DialogIncluirComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(value => {
      setTimeout(() => { this.atualizar(); }, 250);
    });
  }

  // updateFilter(event) {
  //   const val = event.target.value.toLowerCase();
  //   const desired = val.replace(/[^\w\s]/gi, '')
  //   // filter our data
  //   const temp = this.temp.filter(function (d) {
  //     if(d.vendedor){
  //       if (d.vendedor.nome.toLowerCase().indexOf(val) !== -1
  //       || d.descritivo.toLowerCase().indexOf(val) !== -1
  //       || !val)
  //         return d
  //     }else if(d.auxiliar){
  //       if (d.auxiliar.nome.toLowerCase().indexOf(val) !== -1
  //       || d.descritivo.toLowerCase().indexOf(val) !== -1
  //       || !val)
  //         return d
  //     }else {
        
  //     }
  //   });
  //   // update the rows
  //   this.rows = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   //this.table = this.data;
    
  // }

  edit(row){
    console.log(row);

    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '700px',
    }

    dialogConfig.data = row;
    // dialogConfig.data.unidade_id = this.form.controls['unidade_id'].value;
    let dialogRef = this.dialog.open(
      DialogAlterarComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(value => {
      setTimeout(() => { this.atualizar(); }, 250);
    });
  }

}
