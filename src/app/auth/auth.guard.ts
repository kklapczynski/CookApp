import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

// guard to use in front of routes we want to protect - in app-routing.module.ts

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
        boolean | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
        // return true when it is allowed to pass the guard
        // in this case when user is authenticated - logged in
        return this.authService.user.pipe(
            take(1),
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