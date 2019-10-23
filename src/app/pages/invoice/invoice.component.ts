import { Component } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  invoiceItems: any = [{
    'title': 'Ample Admin',
    'subtitle': 'The ultimate admin template',
    'price': 499.00,
    'quantity': 1
  }, {
    'title': 'Material Pro Admin',
    'subtitle': 'Material Based admin template',
    'price': 399.00,
    'quantity': 1
  }, {
    'title': 'Wrapkit',
    'subtitle': 'Bootstrap 4 UI kit',
    'price': 599.00,
    'quantity': 1
  }, {
    'title': 'Admin Wrap',
    'subtitle': 'Free admin template with UI kit',
    'price': 0.00,
    'quantity': 1
  }];

  invoiceTotals: any = [{
    'subtotal': this.getSubTotal(),
    'tax': this.getCalculatedTax(),
    'discount': 0.00,
    'total': 0
  }];

  getSubTotal() {
    let total = 0.00;
    for (let i = 1; i < this.invoiceItems.length; i++) {
      total += (this.invoiceItems[i].price * this.invoiceItems[i].quantity);
    }
    return total;
  }

  getCalculatedTax() {
    return ((2 * this.getSubTotal()) / 100);
  }

  getTotal() {
    return (this.getSubTotal() + this.getCalculatedTax());
  }

  constructor() {}
}
