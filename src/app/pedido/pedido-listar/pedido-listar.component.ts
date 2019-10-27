import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido-listar',
  templateUrl: './pedido-listar.component.html',
  styleUrls: ['./pedido-listar.component.css']
})
export class PedidoListarComponent implements OnInit {

  rota:string = "pedidos"

  constructor() { }

  ngOnInit() {
  }

}
