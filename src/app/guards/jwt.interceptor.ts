import { Injectable } from '@angular/core';
import { 
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take, tap, finalize, catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { LoginService } from '../authentication/login/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    count = 0;
    constructor(
        private router: Router,
        private loginService: LoginService,
        private spinner: NgxSpinnerService
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>>  {
        return this.loginService.getCurrentUser().pipe(
            map(auth => { 
                this.spinner.show();
                this.count++;
                return request.clone({
                    setHeaders: {
                        'Authorization': `Bearer ${auth.currentUser.get().getAuthResponse().id_token}`
                    }
                });
            }),
            switchMap((request) => { 
                return next.handle(request).pipe(tap(() => {},
                    (err: any) => {
                        if (err instanceof HttpErrorResponse) {
                            if (err.status !== 401) {
                                return;
                            }
                            this.spinner.hide ()
                            this.router.navigate(['login']);
                        }
                    }),
                    finalize(() =>{
                        this.count--;
                        if ( this.count == 0 ) this.spinner.hide ();
                    })
                );
            })
        )
    }
}