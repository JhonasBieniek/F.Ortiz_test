import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Headers, RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable'
import {User} from '../user.model';

import 'rxjs/add/operator/map'

@Injectable()
export class LoginService{

    user: User    

    public token_id: string

    constructor(private http:HttpClient){

    }
    
    isLoggedIn(): boolean{
        return this.user !== undefined
    }

    login(email: string, password: string): Observable<User>{
        
        let body = JSON.stringify({email: email, senha: password});
        const ParseHeaders = {
            headers: new HttpHeaders({
             'Content-Type'  : 'application/json'
            })
           };
        return this.http.post<any>('http://test2.fortiz.com.br/api/usuarios/token.json',
                                            body, ParseHeaders)
                                            .map(user => {
                                                // login successful if there's a jwt token in the response
                                                if (user.data && user.data.token) {
                                                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                                                    localStorage.setItem('currentUser', JSON.stringify(user.data));
                                                    localStorage.setItem('TOKEN_NAME', JSON.stringify(user.data.token));                                                }
                                                return user;
                                            });
                                        }
    
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('TOKEN_NAME');    }                                    
                                            
}