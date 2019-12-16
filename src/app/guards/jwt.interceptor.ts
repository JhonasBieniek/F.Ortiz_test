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
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
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
        return next.handle(request)
        .map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && ~~(event.status / 100) > 3) {
              console.info('HttpResponse::event =', event, ';');
            } else console.info('event =', event, ';');
            return event;
          })
          .catch((err: any, caught) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                console.info('err.error =', err.error, ';');
              }
              return Observable.throw(err);
            }
          });;
    }
}