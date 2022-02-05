import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatTabChangeEvent,
} from "@angular/material";
import { DialogConfirmarDeleteComponent } from "../../cadastro/dialog-confirmar-delete/confirmar-delete.component";
import { NotificationService } from "../../shared/messages/notification.service";
import { ClientService } from "../../shared/services/client.service.component";
import { DialogBodyComponent } from "./dialog-body/dialog-body.component";
import page from "./steps.json";

@Component({
  selector: "app-novo",
  templateUrl: "./novo.component.html",
  styleUrls: ["./novo.component.css"],
})
export class NovoComponent implements OnInit {
  data: any = [];
  dados: any = [];
  editing = {};
  isEditable = {};
  page: any = page;
  defaultTab = 0;
  selected: any = [];
  steps: any = this.page.homologacoes;
  rows = [];
  rows2 = [];
  rows3 = [];
  temp = [...this.data];

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  @ViewChild(NovoComponent, { static: false }) table: NovoComponent;
  constructor(
    private clientservice: ClientService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.loadData();
  }

  private loadData() {
    this.clientservice.getHomologacoes().subscribe((res: any) => {
      let i = 0;

      // Sort by homologation status in product row
      this.steps.forEach((e) => {
        let aux =[];
        res.data.forEach((homologation) => {
           homologation.homologation_products.filter(p => {
             if(p.status == e.step) {
              p.homologation_id = homologation.id;
              p.razao_social = homologation.cliente.razao_social;
              p.cliente_id =  homologation.cliente.id;
              p.tipo_cliente = homologation.cliente.tipo_cliente;
              p.cnpj =  homologation.cliente.cnpj
              aux.push(p);
             }});
        });

        // Reduce products for client
        let group = aux,
        result = group.reduce(function (r, a) {
            r[a.cliente_id] = r[a.cliente_id] || [];
            r[a.cliente_id].push(a);
            return r;
        }, Object.create(null));

        // Clients array
        let allClients = [];

        // Populate clients array
        for(let key in result) {
            allClients.push(result[key]);
        }
        this.temp[i] = allClients.sort((a,b)=> a[0].razao_social.localeCompare(b[0].razao_social));
        i++;
      });

      // populate rows in table
      this.rows = [...this.temp];
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.rows[this.defaultTab] = this.temp[this.defaultTab].filter(function (d) {
      if (
        d[0].razao_social.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d[0].cnpj.toLowerCase().indexOf(val) !== -1 ||
        !val
      )
        return d;
    });
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "95vw",
      maxHeight: "95vh",
      width: "95vw",
      height: "95vh",
    };
    //dialogConfig.data = this.dados.data;
    let dialogRef = this.dialog.open(DialogBodyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      this.refreshTable();
    });
  }

  refreshTable() {
    this.loadData();
  }
  // delete(row) {
  //   const dialogConfig = new MatDialogConfig();
  //   const tipo = "homologations";
  //   dialogConfig.data = row;
  //   dialogConfig.data.tipo = tipo;
  //   let dialogRef = this.dialog.open(
  //     DialogConfirmarDeleteComponent,
  //     dialogConfig
  //   );
  //   dialogRef.afterClosed().subscribe((value) => {
  //     value != 1 ? this.refreshTable() : null;
  //   });
  // }
  edit(row) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      maxWidth: "90vw",
      maxHeight: "90vh",
      width: "90vw",
      height: "90vh",
    };
    dialogConfig.data = row.sort(function(a, b) {
      var c:any = new Date(a.data_inicial);
      var d:any = new Date(b.data_inicial);
      return c-d;
    });
    dialogConfig.data.action = "edit";
    let dialogRef = this.dialog.open(DialogBodyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((value) => {
      value != 1 ? this.refreshTable() : null;
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.defaultTab = event.index;
    window.dispatchEvent(new Event("resize"));
    this.selected = [];
  }

  ngOnInit() {}
}
