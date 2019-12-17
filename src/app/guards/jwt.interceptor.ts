import { Injectable } from '@angular/core';
import { 
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import { UserService } from '../shared/services/user.service.component';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private userService: UserService
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        return next.handle(request).pipe( tap(() => {},
        (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            this.userService.signOut();
           return;
          } 
        }
      }));
    }
}