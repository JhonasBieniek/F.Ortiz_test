import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientService } from '../../../../shared/services/client.service.component';
import { NotificationService } from '../../../../shared/messages/notification.service';

@Component({
  selector: 'app-dialog-estornar',
  templateUrl: './dialog-estornar.component.html',
  styleUrls: ['./dialog-estornar.component.css']
})
export class DialogEstornarComponent implements OnInit {

  public form: FormGroup;

  rows: any = [];
  selected: any = [];

  isSelected

  @ViewChild(DialogEstornarComponent, { static: false }) table: DialogEstornarComponent;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEstornarComponent>,
    public clientService: ClientService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data)
    setTimeout(() => this.rows = this.data.nota_parcelas.filter(e =>
      e.status_recebimento == true), 300)

    this.form = this.fb.group({
      obs: this.data.obs,
    });
  }
  async save() {
    //this.data.status
    // this.selected.forEach(e => {
    //   this.data.nota_parcelas.map(a =>{
    //     if(a.id == e.id){
    //       //a.modified = new Date();
    //       a.estorno = true;
    //       // a.status_recebimento = false;
    //       // a.data_recebimento = null;
    //     }
    //     return a;
    //   })
    // });
    let data = {
      obs: this.form.get('obs').value,
      id: this.data.id,
      nota_parcelas: this.data.nota_parcelas
    }
    // this.data.status = 'aberto'
    this.clientService.estornarParcela(data).subscribe((res:any) => {
      if(res.success === true){
        this.notificationService.notify(res.data);
        this.dialogRef.close(true);
      }else{
        this.notificationService.notify(res.data);
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  // onSelect({selected}) {
  //   this.selected = selected
  //   console.log(this.selected)
  // }

}
