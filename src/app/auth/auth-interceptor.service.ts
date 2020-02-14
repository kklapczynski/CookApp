import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromAppStore from '../store/app.reducer';

// this interceptor is used to add user token to all requests that require it
// with it we can define it here once, instead of attaching token query param in every method issuing a request

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<fromAppStore.AppState>) {};
    // intercept a request and attach user token to it if needed
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // get user data with token from auth.service - needs to be injected for taht
        // this.authService.user.subscribe(); - but we need single value of user
        // return this.authService.user // replaced by Store
        return this.store.select('auth')      // returns Observable of auth.State 
            .pipe(
                take(1),
                map(authState => {          // get user from auth.State
                    return authState.user
                }),
                exhaustMap(user => {
                    // if there is already user and its token then attach it to request
                    if(user) {
                        // take original request and add token to it
                        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
                        // intercept method must return observable using handler - issue request and observe the answer
                        return next.handle(modifiedReq);
                    }
                    // otherwise send request wihtout changing it
                    return next.handle(req);
                })
            )
    }
}