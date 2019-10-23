import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { LoginService} from '../../../authentication/login/login.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent {
  currentUser: any;
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, 
                                  media: MediaMatcher, 
                                  public menuItems: MenuItems,
                                  private loginService: LoginService) 
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    console.log('CurrentUser', JSON.parse(localStorage.getItem('currentUser')))
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  } 

}