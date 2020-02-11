import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';


// this interceptor is used to add user token to all requests that require it
// with it we can define it here once, instead of attaching token query param in every method issuing a request

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {};
    // intercept a request and attach user token to it if needed
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // get user data with token from auth.service - needs to be injected for taht
        // this.authService.user.subscribe(); - but we need single value of user
        return this.authService.user
            .pipe(
                take(1),
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