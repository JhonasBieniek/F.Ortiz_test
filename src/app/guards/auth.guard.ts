import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../authentication/login/login.service';

@Injectable()

export class AuthGuard implements CanActivate{
    constructor(
        private router: Router,
        private loginService: LoginService
        ){
        }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        
        if(this.loginService.isUserSignedIn()) {
            return true;
        }
        this.router.navigate(['login']);
        return false;
    }
}