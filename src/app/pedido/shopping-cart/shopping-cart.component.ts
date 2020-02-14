import { Component, OnInit } from '@angular/core';
import {trigger, state, style, transition, animate, keyframes} from '@angular/animations'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { OrderService } from '../../shared/services/order.service.component';
import { OrderItem } from '../order-item.model';
import { ClientService } from '../../shared/services/client.service.component';

@Component({
  selector: 'mt-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  animations: [
    trigger('row', [
      state('ready', style({opacity: 1})),
      transition('void => ready', animate('300ms 0s ease-in', keyframes([
        style({opacity:0, transform: 'translateX(-30px)', offset:0}),
        style({opacity:0.8, transform: 'translateX(10px)', offset:0.8}),
        style({opacity:1, transform: 'translateX(0px)', offset:1})
      ]))),
      transition('ready => void', animate('300ms 0s ease-out', keyframes([
        style({opacity:1, transform: 'translateX(0px)', offset:0}),
        style({opacity:0.8, transform: 'translateX(-10px)', offset:0.2}),
        style({opacity:0, transform: 'translateX(30px)', offset:1})
      ])))
    ])
  ]
})
export class ShoppingCartComponent implements OnInit {

  rowState = 'ready'
  public formPedido: FormGroup;
  dataUnidades: any;
  unidades = [];
  selectedUnidade: string;
  totalValor:number =0;


  constructor(private shoppingCartService: OrderService, 
              private fb: FormBuilder,
              private clientService: ClientService) { 
    this.formPedido = this.fb.group({
      camposForm: this.fb.array([]),
    })
    this.clientService.getUnidades().subscribe(res =>{
      this.dataUnidades = res;
      this.unidades = this.dataUnidades.data; 
    });
  }

  ngOnInit() {
   
  }
  
  clear(){
    this.formPedido = this.fb.group({
      camposForm: this.fb.array([]),
    })
  }

  removeItem(index){
    const campos = this.formPedido.get('camposForm') as FormArray;
    campos.removeAt(index);
  }

  totalCalc(qtd, valor, i){
    const campos = this.formPedido.get('camposForm') as FormArray;
    if( qtd != undefined && valor != undefined ){
      campos.controls[i].get('valorTotal').setValue(valor*qtd);
    }
  }

  total() {
    const campos = this.formPedido.get('camposForm') as FormArray;
    let total = 0;
    campos.controls.forEach(element => {
      total += element.get('valorTotal').value
    });
    return Math.round((total)*100)/100;
  }

  addForm(item:any){
    const campos = this.formPedido.controls.camposForm as FormArray;
    campos.push(this.fb.group({
      codigo: item.codigo,
      nome: item.nome,
      quantidade: item.quantidade,
      unidade: {value: item.unidade, disabled: true},
      embalagem: {value: item.embalagem, disabled: true},
      tamanho: item.tamanho,
      ipi: {value: item.ipi, disabled: true},
      desconto: item.desconto,
      valorUnitario: item.valorUnitario,
      valorTotal: {value: 0, disabled: true},
      comissao: item.comissao,
      observacao: item.observacao
    }));
  }

}
