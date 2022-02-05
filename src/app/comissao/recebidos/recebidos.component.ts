import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';

@Component({
  selector: 'app-recebidos',
  templateUrl: './recebidos.component.html',
  styleUrls: ['./recebidos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecebidosComponent implements OnInit {

  form: FormGroup;
  pageTitle: string = "Recebidos";
  representadas = [];
  rows: any = [];
  temp: any = [];
  data: any = [];

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.clientservice.getRepresentadasAtivas().subscribe((res: any) => this.representadas = res.data);
    this.form = this.fb.group({
      dtInicio: [null],
      dtFinal: [null],
      representada_id: [null],
    });
  }

  reverter(row:any){
    
    if(confirm("Tem certeza que deseja reverter este recebimento? ")) {
      this.clientservice.reverterComissao(row).subscribe((res: any) => {
        if(res.success == true){
          this.getRecebidos();
        }else{
          this.notificationService.notify('Não foi possivel reverter a comissao recebida informe ao administrador !');
        }
        // this.data = res.data;
        // this.rows = this.data
        // this.temp = [...this.data];
      });
    }
    
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows = this.temp.filter(function(d) {
      if( d.nota.num_nota.toLowerCase().indexOf(val) !== -1 || !val ||
          d.nota.pedido.num_pedido.toLowerCase().indexOf(val) !== -1 )
      return d
    }); 
  }

  clear() {
    this.form = this.fb.group({
      dtInicio: [null],
      dtFinal: [null],
      representada_id: [null],
    });

    
    this.data = [];
    this.rows = [];
    this.temp = [];

    
  }

  getRecebidos() {
    this.clientservice.comissoesRecebidas(this.form.value).subscribe((res: any) => {
      this.data = res.data;
      this.rows = this.data
      this.temp = [...this.data];
    });
  }
}
