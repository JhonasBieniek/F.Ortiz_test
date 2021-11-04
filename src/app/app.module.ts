import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { AppBreadcrumbComponent } from './layouts/full/breadcrumb/breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { DateFormatPipe } from './shared/pipes/dateFormat.pipe';
import { AlertComponent } from './alert/alert.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthGuard } from './guards/auth.guard';
import { OrderService } from './shared/services/order.service.component';
import { JwtInterceptor } from './guards/jwt.interceptor';
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { CadastroModule } from './cadastro/cadastro.module';
import { PedidoModule } from './pedido/pedido.module';
 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

registerLocaleData(ptBr)

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppBlankComponent,
    AppSidebarComponent,
    AppBreadcrumbComponent,
    DateFormatPipe,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    HttpClientJsonpModule,
    PerfectScrollbarModule,
    SharedModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    AuthenticationModule,
    CadastroModule,
    PedidoModule
  ],
  providers: [
    HttpClientModule,
    AuthGuard,
    OrderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
    },
  ],
  entryComponents: [
    AlertComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
