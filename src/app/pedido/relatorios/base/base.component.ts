import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  form: FormGroup;
  type: {name: string, value:number}[] = []
  relatorios: {name: string, value:number}[] = [
    {name:"Pedido", value: 1},
    {name:"Cliente sem compra", value: 2},
    {name:"Clientes Novos", value: 3},
    {name:"Comparativo de Vendas", value: 4},
    {name:"Consumo", value: 5},
    // {name:"Faturamento", value: 5},
    {name:"Notas", value: 6},
    {name:"Produtos Vendidos", value: 7},
    {name:"Ranking", value: 8},
  ]

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      dtInicio: [null],
      dtFinal: [null],
      representada_id: [null],
      tipo: ['faturamento'],
      campo_ordem: null,
      tipo_ordem: null,
      tipo_data: null,
      num_nota: null,
    });
    console.log(this.type)
  }

  private charge(type){
    this.type = type
  }
}
