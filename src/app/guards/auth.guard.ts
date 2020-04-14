import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../shared/services/user.service.component';

@Injectable()

export class AuthGuard implements CanActivate{
    constructor(
        private router: Router, 
        private userservice: UserService
        ){  
        }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if(localStorage.getItem('currentUser')) {
            if(this.userservice.isUserSignedIn()){
                return true;
            }
        }
        this.router.navigate(['glogin']);
        return false;
    }
}