import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from "@angular/material";
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-view-nota',
  templateUrl: './dialog-view-nota.component.html',
  styleUrls: ['./dialog-view-nota.component.css']
})
export class DialogViewNotaComponent implements OnInit {
  dados:any ;
  constructor(
    private clientservice: ClientService,
    public dialogRef: MatDialogRef<DialogViewNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  loadData(){
    this.clientservice.getNotasID(this.data.id).subscribe((res:any)=> {
      this.dados = res.data;
    })
  }

  ngOnInit() {
  }

}
