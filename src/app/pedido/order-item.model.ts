import { ItemPedido } from "./itemPedido.model";

export class OrderItem {
    constructor( public item: ItemPedido) { }

    valor(): any{   
            
    return  this.item.valorUnitario * this.item.quantidade
    }
}