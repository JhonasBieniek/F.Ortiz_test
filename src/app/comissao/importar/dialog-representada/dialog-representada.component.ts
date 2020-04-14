import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-representada',
  templateUrl: './dialog-representada.component.html',
  styleUrls: ['./dialog-representada.component.css']
})
export class DialogRepresentadaComponent implements OnInit {
  representadas:any;
  constructor( 
    public dialogRef: MatDialogRef<DialogRepresentadaComponent>,
    public clientService: ClientService
    ) { }

  ngOnInit() {
    this.clientService.getRepresentadas().subscribe((res:any) => {
      this.representadas = res.data;
    })
  }

}
