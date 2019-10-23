import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ClientService } from '../shared/services/client.service.component';

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private router: Router, private clientservice: ClientService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (localStorage.getItem('currentUser')) {
            if (!this.clientservice.isTokenExpired()) {
                return true;
            }
        }

        // not logged in so redirect to login page
        this.router.navigate(['authentication/login'], { queryParams: { returnUrl: state.url }});
        return false;

    }
}