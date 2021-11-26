import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { FormControl } from '@angular/forms';
import { NotificationService } from '../../shared/messages/notification.service';
import { ClientService } from '../../shared/services/client.service.component';
import { connectWampChannel } from 'wamprx';
import { delay, retryWhen, switchMap } from 'rxjs/operators';
import { ViewPedidoOrcamentoComponent } from '../../pedido/view-pedido/view-pedido.component';

//import { webSocket, WebSocketSubject } from 'rxjs/internal-compatibility';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
//import {Connection, Session} from 'autobahn';

declare var require: any;
const data: any = require('./data.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

export interface Element {
  name: string;
  pic: string;
  weight: number;
  designation: string;
}

const ELEMENT_DATA: Element[] = [
  {
    pic: 'assets/images/users/1.jpg',
    name: 'Nirav joshi',
    weight: 1.0079,
    designation: 'H'
  },
  {
    pic: 'assets/images/users/2.jpg',
    name: 'Sunil joshi',
    weight: 4.0026,
    designation: 'He'
  },
  {
    pic: 'assets/images/users/3.jpg',
    name: 'Vishal Bhatt',
    weight: 6.941,
    designation: 'Li'
  },
  {
    pic: 'assets/images/users/4.jpg',
    name: 'Beryllium Lon',
    weight: 9.0122,
    designation: 'Be'
  },
  {
    pic: 'assets/images/users/5.jpg',
    name: 'Boron son',
    weight: 10.811,
    designation: 'B'
  },
  {
    pic: 'assets/images/users/6.jpg',
    name: 'Carbon hryt',
    weight: 12.0107,
    designation: 'C'
  },
  {
    pic: 'assets/images/users/7.jpg',
    name: 'Nitro oxur',
    weight: 14.0067,
    designation: 'N'
  }
];

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Dashboard2Component implements OnInit {
  // Barchart
  barChart1: Chart = {
    type: 'Bar',
    data: data['Bar'],
    options: {
      seriesBarDistance: 15,
      high: 12,
      height: 325,
      axisX: {
        showGrid: false,
        offset: 20
      },
      axisY: {
        showGrid: true,
        offset: 40
      }
    },
    responsiveOptions: [
      [
        'screen and (min-width: 640px)',
        {
          axisX: {
            labelInterpolationFnc: function(
              value: number,
              index: number
            ): string {
              return index % 1 === 0 ? `${value}` : null;
            }
          }
        }
      ]
    ]
  };

  // Doughnut
  public doughnutChartLabels: string[] = ['Desktop', 'Mobile', 'Tablet'];
  public doughnutChartOptions: any = {
    responsive: false
  };

  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';
  public doughnutChartLegend = false;

  // This is for the comments
  mycomments: Object[] = [
    {
      name: 'James Anderson',
      content:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/1.jpg',
      status: 'Pending',
      class: 'info',
      date: 'April 14, 2016'
    },
    {
      name: 'Michael Jorden',
      content:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/2.jpg',
      status: 'Approved',
      class: 'light-success',
      date: 'April 14, 2016'
    },
    {
      name: 'James Anderson',
      content:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/3.jpg',
      status: 'Pending',
      class: 'danger',
      date: 'April 14, 2016'
    },
    {
      name: 'Johnathan Doeting',
      content:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/1.jpg',
      status: 'Pending',
      class: 'info',
      date: 'April 14, 2016'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/3.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/6.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/7.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/8.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/6.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  // bar chart
  public barChartData: Array<any> = [
    { data: [1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1], label: 'Cost' }
  ];
  public barChartLabels: Array<any> = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15'
  ];
  public barChartOptions: any = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.3,
        categoryPercentage: 0.7
      }],
      yAxes: [{
        display: false
      }]
    }
  };
  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      hoverBackgroundColor: 'rgba(255, 255, 255, 0.5)',
      hoverBorderWidth: 2,
      hoverBorderColor: 'rgba(255, 255, 255, 0.5)'
    }
  ];
  public barChartLegend = false;
  public barChartType = 'bar';

  clienteBusca = new FormControl("");
  clientes: any = [];
  $clientes: any = [];
  cliente_id: any = null;
  UltimosPedidos: any[] = [];
  dialogConfig = new MatDialogConfig();
  clientes_total = 0;
  representadas_total = 0;
  pedidosAbertos_total = 0;
  pedidosFaturados_total = 0;
  

  webSocketConn: any;
  // This is for the table responsive

  constructor(breakpointObserver: BreakpointObserver,
    private clientservice: ClientService,
    private notificationService: NotificationService,
    private dialog: MatDialog) {

    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ? 
          ['pic', 'name', 'weight', 'designation'] : 
          ['pic', 'name', 'weight', 'designation'];
    });

    this.clientservice.getClientes().subscribe((res:any) =>{
      this.clientes = res.data;
    });

    this.clientservice.getTotalClientes().subscribe((res:any) =>{
      this.clientes_total = res.data;
    });

    this.clientservice.getTotalRepresentadas().subscribe((res:any) =>{
      this.representadas_total = res.data;
    });

    this.clientservice.getTotalPedidosAbertos().subscribe((res:any) =>{
      this.pedidosAbertos_total = res.data;
    });

    this.clientservice.getTotalPedidosfaturados().subscribe((res:any) =>{
      this.pedidosFaturados_total = res.data;
    });
  }

  ngOnInit() {
    this.dialogConfig= {
      width: '98vw',
      height: '98vh'
    }
  }

  searchCliente() {
    let $cliente: Observable<any[]>;
    let nome = this.clienteBusca.value;
    if (nome != "") {
      const val = nome.toLowerCase().split(" ");
      let xp = "";
      val.forEach((e) => {
        xp += `(?=.*${e})`;
      });
      const re = new RegExp(xp, "g");
      this.$clientes = this.clientes.filter(function (d) {
        if (
          d.razao_social.toLowerCase().match(re) ||
          d.cnpj.toLowerCase().match(re) ||
          !val
        )
          return d;
      });
    } else {
      this.$clientes = $cliente;
    }
  }

  setCliente(cliente) {
    this.cliente_id = cliente.id;
    //this.form.get("cliente_id").setValue(cliente.id);
  }

  limpar(){
    this.cliente_id = null;
    //this.form.get('cliente_id').setValue(null);
    this.clienteBusca.setValue('');
    this.$clientes = [];
  }

  buscarPedidos(){
    this.clientservice.getLastsByCliente(this.cliente_id).subscribe((res: any) => {
      if(res.success == true){
        if(res.data.length > 0 ){
          console.log(res)
          this.UltimosPedidos = res.data;
        }else{
          this.notificationService.notify("Não foi localizado nenhum pedido!");
        }
      }
    });
  }

  view(row){
    this.dialogConfig.data = {
      tipo: 'pedidos',
      pedido: row
    }
    let dialogRef = this.dialog.open(ViewPedidoOrcamentoComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(value =>{
      this.buscarPedidos();
    })
  }
  
  // tslint:disable-next-line:member-ordering
  displayedColumns = ['pic', 'name', 'weight', 'designation'];
  // tslint:disable-next-line:member-ordering
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  // tslint:disable-next-line:member-ordering
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
}
