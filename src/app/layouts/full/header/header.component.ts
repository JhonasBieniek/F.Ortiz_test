import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { LoginService } from '../../../authentication/login/login.service';
import { ClientService } from '../../../shared/services/client.service.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};
  currentUser: any;
  
  // This is for Notifications
  public notifications: Object[] = [];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    }
  ];
  notificationObs:any;
  

  constructor(
    private loginService: LoginService,
    private clientservice: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.requisitarNotificacoes();
    this.notificationObs = Observable.interval(180000)
    .subscribe((val) => { this.requisitarNotificacoes()});
  }

  requisitarNotificacoes(){
    this.notifications = [];
    this.clientservice.getNotificationsByUser().subscribe((res: any) => {
      if(res.data.length > 0){
        res.data.forEach(cotacao => {
          this.notifications.push({
            id: cotacao.id,
            orcamento_id: cotacao.orcamento_id,
            title: cotacao.orcamento.situation == 2 ? 'Cotação Aprovada' : 'Nova Cotação',
            subject: 'Cotação id: ' +cotacao.orcamento_id,
            time: cotacao.created
          })
        });
      }
    });
  }

  readMark(row, index){
    this.clientservice.marcarLido(row.id).subscribe((res: any) => {
      if(res.status){
        this.notifications.splice(index,1);
      }else{
      }
    });
  }

  orcamento(row, index){
    this.clientservice.marcarLido(row.id).subscribe((res: any) => {
      if(res.status){
        this.notifications.splice(index,1);
        let navigationExtras: NavigationExtras = {
          queryParams: {
              "orcamento_id": row.orcamento_id,
          }
        };
        let param = row.orcamento_id;
        if(this.router.url.includes(param)){
          this.router.navigate(['/pedidos/cotacoes'])
          setTimeout(()=>{
            this.router.navigate(['/pedidos/cotacoes'], navigationExtras);
          }, 500)
        } else{
          this.router.navigate(['/pedidos/cotacoes'], navigationExtras);
        }
      }else{
      }
    });
  }

  public signOut(): void {
    this.loginService.signOut()
  }
}
