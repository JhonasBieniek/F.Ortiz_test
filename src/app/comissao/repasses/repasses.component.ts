import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ClientService } from '../../shared/services/client.service.component';
import { NotificationService } from '../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AlertComponent } from '../../alert/alert.component';
import { ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../pedido/novo/novo.component';

@Component({
  selector: 'app-repasses',
  templateUrl: './repasses.component.html',
  styleUrls: ['./repasses.component.css'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class RepassesComponent implements OnInit {

  funcionario: FormGroup;
  usuario: FormGroup;
  isLinear: boolean = false;
  pageTitle:string = "";
  currentAction:string ="";
  showTable:boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientservice: ClientService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private datePipe : DatePipe,
  ){}    

  ngOnInit() {
    this.setCurrentAction();
    this.funcionario = this.fb.group({
      tipo: ["Faturado"],
      dtInicio: [null],
      dtFinal: [null],
      nota: [null],
      select: [null],
      selected: [null]
    });
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  //Private Methods
  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "receber")
      this.currentAction = "receber"
    else
      this.currentAction = "repasses"
  }

  private setPageTitle() {
    if(this.currentAction == 'receber'){
      this.pageTitle = 'Comissões a receber'
    }else{
      this.pageTitle = 'Repasses de comissões';
    }
  }

  clear(){

  }
  
  Submit(){
    let data = this.funcionario.value;
    data.nascimento = this.datePipe.transform(data.nascimento, 'yyyy-MM-dd');
    this.clientservice.addFuncionario(data).subscribe((res:any) => {
      if(res.success == true){
        this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
      }else{
        this.notificationService.notify(`Erro contate o Administrador`)
      }
    });
  }
}