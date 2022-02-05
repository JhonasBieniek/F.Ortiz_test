import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from '../../../shared/messages/notification.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-dialog-cancelar-orcamentos-antigos',
  templateUrl: './dialog-cancelar-orcamentos-antigos.component.html',
  styleUrls: ['./dialog-cancelar-orcamentos-antigos.component.css']
})
export class DialogCancelarOrcamentosAntigosComponent implements OnInit {

  temp: any[] = [];
  rows: any[] = [];
  selected: any = [];

  constructor(private clientservice: ClientService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DialogCancelarOrcamentosAntigosComponent>) { 
    this.clientservice.getOrcamentos_antigos().subscribe((res: any) => {
      this.rows = res.data;
      this.temp = [...res.data];
    });
  }

  ngOnInit() {
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return (
        d.cliente.nome_fantasia.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.representada.nome_fantasia.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.rows = temp;
  }

  onSelect({ selected }) {
    //console.log('Select Event', selected, this.selected);

    // this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
  }

  cancelarTodos(){
    this.clientservice.cancelarAntigos(this.rows).subscribe((res: any) => {
      if(res.status == true){
          this.notificationService.notify(`Orçamentos cancelados com Sucesso!`);
          this.dialogRef.close();
      }else{
          this.notificationService.notify(`Não foi possivel cancelar todos os orçamentos informe ao administrador!`);
      }
    });
  }

  cancelarSelecionados(){
    if(this.selected.length > 0){
      this.clientservice.cancelarAntigos(this.selected).subscribe((res: any) => {
        if(res.status == true){
          this.notificationService.notify(`Orçamentos cancelados com Sucesso!`);
          this.dialogRef.close();
        }else{
            this.notificationService.notify(`Não foi possivel cancelar todos os orçamentos informe ao administrador!`);
        }
      });
    }else{
      this.notificationService.notify(`Selecione um orçamento para prosseguir!`);
    }
  }
}
