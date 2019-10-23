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

  items(): any[] {
    return this.shoppingCartService.items    
  }

  clear(){
    this.shoppingCartService.clear()
  }
 

  removeItem(item: any){
    this.shoppingCartService.removeItem(item)
  }

  addItem(item: any){
    this.shoppingCartService.addItem(item)
    console.log('Me chamaram')
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
  addForm(){
    const campos = this.formPedido.controls.camposForm as FormArray;
    campos.push(this.fb.group({
      cliente: '',//new FormControl('',[Validators.compose([Validators.required, CustomValidators.number])]),
      quantidade: '',
      unidade: {value:'', disabled: true},
      embalagem: {value:'', disabled: true},
      tamanho: '',
      ipi: {value:'', disabled: true},
      desconto: '',
      valorUnitario: '',
      valorTotal: {value: 0, disabled: true},
      comissao: '',
      observacao: ''
    }));
    console.log(campos)
  }
  // addFormPlanilha(data){
  //   console.log(data, "dataForm")
  //   const campos = this.formPedido.controls.camposForm as FormArray;
  //     campos.push(this.fb.group({
  //       cliente: '',//new FormControl('',[Validators.compose([Validators.required, CustomValidators.number])]),
  //       quantidade: data.quantidade,
  //       unidade: data.unidade,
  //       embalagem: data.embalagem,
  //       ipi: data.ipi,
  //       desconto: '',
  //       valorUnitario: data.valorUnitario,
  //       comissao: data.comissao,
  //       tamanho: data.tamanho,
  //       valorTotal: data.valorTotal,
  //       observacao: ''
  //     }));
  //     console.log(campos, "campos")
  // }


}
