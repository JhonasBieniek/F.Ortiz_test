import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-add-nota',
  templateUrl: './dialog-add-nota.component.html',
  styleUrls: ['./dialog-add-nota.component.css']
})
export class DialogAddNotaComponent implements OnInit {
  pedidos: any;
  constructor(
    private clientservice: ClientService
  ) { 
    this.clientservice.getPedidoSemNota().subscribe((res:any) =>{
      this.pedidos = res.data;
    });
  }

  ngOnInit() {
    
  }


}
