import {Injectable, NgZone} from "@angular/core";
import * as _ from "lodash";
import {GoogleAuthService} from "ng-gapi/lib/GoogleAuthService";
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { User } from '../user.model'

@Injectable()
export class LoginService{
    public static readonly SESSION_STORAGE_KEY: string = "accessToken";
    private user: GoogleUser = undefined;

    constructor(
        private googleAuthService: GoogleAuthService,
        private ngZone: NgZone,
        private router: Router
        ) {}

    public setUser(user: GoogleUser): void {
        this.user = user;
    }

    public getCurrentUser(): Observable<GoogleAuth> {
        return  this.googleAuthService.getAuth();
    }

    public getToken(): string {
        let token: string = sessionStorage.getItem(LoginService.SESSION_STORAGE_KEY);
        if (!token) {
            throw new Error("no token set , authentication required");
        }
        return sessionStorage.getItem(LoginService.SESSION_STORAGE_KEY);
    }

    public signIn() {
        this.googleAuthService.getAuth().subscribe((auth) => {
            auth.signIn().then(res => this.signInSuccessHandler(res), err => this.signInErrorHandler(err));
        });
    }



    //TODO: Rework
    public signOut(): void {
        this.googleAuthService.getAuth().subscribe((auth) => {
            try {
                auth.signOut();
            } catch (e) {
                console.error(e);
            }
            sessionStorage.removeItem(LoginService.SESSION_STORAGE_KEY)
            localStorage.removeItem('currentUser');
            this.router.navigate(['login']);
        });
        
    }

    public isUserSignedIn(): boolean {
        return !_.isEmpty(sessionStorage.getItem(LoginService.SESSION_STORAGE_KEY));
    }

    public signInSuccessHandler(res: GoogleUser) {
        this.ngZone.run(() => {
            this.user = res;
            sessionStorage.setItem(
                LoginService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
            );
            let dados = {
                "token": res.getAuthResponse().id_token,
                "usuario":{
                    "email": res.getBasicProfile().getEmail(),
                    "nome": res.getBasicProfile().getName()
                } 
            }
            localStorage.setItem('currentUser', JSON.stringify(dados));
            this.router.navigate(['dashboards']);
        });
    }

    private signInErrorHandler(err) {
        console.warn(err);
    }
}