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
import { filter, switchMap, take, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { LoginService } from '../authentication/login/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private router: Router,
        private loginService: LoginService
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>>  {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            request = this.addToken(request, currentUser.token);
        }
        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(request, next);
                }
            })
        );
    }

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
                return next.handle(this.addToken(request, token));
            }));
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }
}