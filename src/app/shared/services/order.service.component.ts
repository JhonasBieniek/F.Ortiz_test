import { OrderItem } from "../../pedido/order-item.model";
import { NotificationService } from "../messages/notification.service";
import { Injectable } from "@angular/core";
import { ItemPedido } from "../../pedido/itemPedido.model";
import { CartItem } from "../../pedido/shopping-cart/cart-item.model";

@Injectable()
export class OrderService{
    items = [];
    itemsNew = [];

    constructor(private notificationService: NotificationService){}

    clear(){
      this.items = []
    }
  
    addItem(item:any){
      console.log(item, "item add")
      this.items.push(new CartItem( 
        item.codigo,
        item.nome,
        item.unidade.sigla,
        item.embalagem,
        item.ipi,
        item.quantidade,
        item.desconto,
        item.valorUnitario,
        item.comissao,
        item.tamanho,
        item.valorTotal,
        item.observacao,
        item.id)) // adiciona um novo 
      this.notificationService.notify(`Você adicionou o item ${item.nome}`)
    }

    addItemPlan(item:any){
      console.log(item, "item add Plan")
      this.items.push(new CartItem( 
        item.codigo,
        item.nome,
        item.unidade,
        item.embalagem,
        item.ipi,
        item.quantidade,
        item.desconto,
        item.valorUnitario,
        item.comissao,
        item.tamanho,
        item.valorTotal = Math.round((item.quantidade * item.valorUnitario)*100)/100,
        item.observacao,
        item.id)) // adiciona um novo 
      this.notificationService.notify(`Você adicionou o item ${item.nome}`)
      
        console.log(this.items)
      
    }
    addItemNew(item:any){
      console.log(item, "item New")
      this.itemsNew.push(new CartItem( 
        item.codigo,
        item.nome,
        item.unidade,
        item.embalagem,
        item.ipi,
        item.quantidade,
        item.desconto,
        item.valorUnitario,
        item.comissao,
        item.tamanho,
        item.valorTotal = Math.round((item.quantidade * item.valorUnitario)*100)/100,
        item.observacao,
        item.representada_id)) // adiciona um novo 
    }
  
  
    removeItem(itens:OrderItem){
      this.items.splice(this.items.indexOf(itens), 1)
      this.notificationService.notify(`Você removeu o item ${itens.item.nome}`)
    }
  
    total(): number{
      //console.log(this.items, 'itens total')
      return this.items
        .map(item => item.valor())
        .reduce((prev, value)=> prev+value, 0)
    }
  }