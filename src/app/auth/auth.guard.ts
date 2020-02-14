import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromAppStore from '../store/app.reducer';

@Injectable({
    providedIn: 'root'
})

// guard to use in front of routes we want to protect - in app-routing.module.ts

export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store<fromAppStore.AppState>
        ) {}
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
        | boolean 
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> 
    {
        // return true when it is allowed to pass the guard
        // in this case when user is authenticated - logged in
        return this.store.select('auth', 'user').pipe(
            take(1),
            // map(authState => {           // shorter version is to add 'user' to this.store.select()
            //     return authState.user;
            // }),
            map(user => {
            // return true when there is a user returned from authService
            const isAuth = !!user;  // trick to convert existing object to true or to false when no object
            if(isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
            })
            // older solution to redirect when stopped by guard
            // ,tap(isAuth => {
            //     if(!isAuth) {
            //         this.router.navigate(['/auth']);
            //     }
            // })
        );
    }
}