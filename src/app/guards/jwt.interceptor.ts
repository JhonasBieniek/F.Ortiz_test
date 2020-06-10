import { Injectable } from '@angular/core';
import { 
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take,  finalize, catchError, tap } from 'rxjs/operators';
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
        this.spinner.show();
        this.count++;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            request = this.addToken(request, currentUser.token);
        }
        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(request, next);
                }
            }),
            finalize(() =>{
                this.count--;
                if ( this.count == 0 ) this.spinner.hide ();
            })
        );
    }
        /*
        return this.loginService.getCurrentUser().pipe(
            mergeMap( auth => { 
                this.spinner.show();
                this.count++;
                
                if(auth.currentUser.get().getAuthResponse().id_token){
                    request = request.clone({
                        setHeaders: {
                            'Authorization': `Bearer ${auth.currentUser.get().getAuthResponse().id_token}`
                        }
                    });
                }
                
                return next.handle(request).pipe(
                    tap(() => {},
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
    */
    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`            
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.loginService.getCurrentUser().pipe(
            switchMap((auth) => {
                const token = auth.currentUser.get().getAuthResponse().id_token;
                this.loginService.signInSuccessHandler(auth.currentUser.get());
                this.isRefreshing = false;
                this.refreshTokenSubject.next(token);
                return next.handle(this.addToken(request, token)).pipe(
                    tap(() => {},
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
            }));
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    this.spinner.hide ();
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }	        
    }

}