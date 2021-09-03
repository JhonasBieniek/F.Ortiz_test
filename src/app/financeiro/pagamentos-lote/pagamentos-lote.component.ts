import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079},
  {position: 2, name: 'Helium', weight: 4.0026},
  {position: 3, name: 'Lithium', weight: 6.941},
  {position: 4, name: 'Beryllium', weight: 9.0122},
  {position: 5, name: 'Boron', weight: 10.811},
  {position: 6, name: 'Carbon', weight: 12.0107},
  {position: 7, name: 'Nitrogen', weight: 14.0067},
  {position: 8, name: 'Oxygen', weight: 15.9994},
  {position: 9, name: 'Fluorine', weight: 18.9984},
  {position: 10, name: 'Neon', weight: 20.1797},
];

@Component({
  selector: 'app-pagamentos-lote',
  templateUrl: './pagamentos-lote.component.html',
  styleUrls: ['./pagamentos-lote.component.css']
})
export class PagamentosLoteComponent implements OnInit {
  
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  displayedColumns: string[] = ['select', 'position', 'name', 'weight'];
  displayedColumnsPayment: string[] = ['position', 'name', 'weight'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSourceSelected: PeriodicElement[] = [];
  selection = new SelectionModel<PeriodicElement>(true, []);

  public form: FormGroup;
  public formPayments: FormGroup;
  contas: [] = [];
  
  funcionarioBusca = new FormControl("");
  funcionarios: any = [];
  $funcionarios: any = [];
  step = 0;



  data: any = [];
  dados: any = [];
  rows = [];
  temp = [...this.data];


  

  //@ViewChild(RelatoriosComponent, { static: false }) table: RelatoriosComponent;
  constructor(private clientservice: ClientService, private fb: FormBuilder, private notificationService: NotificationService) {
    //this.loadData();
    this.clientservice.getFuncPgtoLote().subscribe((res: any) => {
      this.funcionarios = res.data;
      this.$funcionarios = res.data;
    });

    this.clientservice.getContas().subscribe((res: any) => {
      this.contas = res.data;
    });

    
  }

  filterFornecedor() {
    let $funcionario: Observable<any[]>;
    let nome = this.funcionarioBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$funcionarios = this.funcionarios.filter(function (d) {
        if (
          d.nome.toLowerCase().match(re) ||
          d.email.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$funcionarios = $funcionario;
    }
  }

  setCliente(funcionario) {
    console.log(funcionario);
    this.form.get("funcionario_id").setValue(funcionario.id);
  }

  ngOnInit() {
    this.form = this.fb.group({
      funcionario_id: [null]
    });
    
    this.formPayments = this.fb.group({
      hideRequired: true,
      floatLabel: "auto",
      datapagamento: [null,Validators.required],
      conta_id: [null, Validators.required],
      observacao: [null]
    });

  }

  getTotalCost() {
    return this.dataSourceSelected.map(t => t.weight).reduce((acc, value) => acc + value, 0);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    this.dataSourceSelected = [];
    this.selection.selected.forEach(element => {
      this.dataSourceSelected.push(element)
    });
  }
  mostrar(){
    console.log(this.formPayments.value)
  }

  prevStep() {
    this.step--;
    this.dataSourceSelected = [];
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  limpar(){
    this.form.get('funcionario_id').setValue(null);
    this.funcionarioBusca.setValue('');
    this.$funcionarios = this.funcionarios;
  }

  filtrar(){
  }


}
