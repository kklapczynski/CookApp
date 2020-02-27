// ngrx effects is to integrate processes not immediately important to store (= they don't change state) - their results are, but not a process itself: async actions lika http calls, localStorage etc.
// these async processes could stay in services, but it's good practice to integrate them in ngrx

import { Actions, ofType, Effect } from '@ngrx/effects';    // observable of all dispatched actions (it's different object then Action from ngrx/store)
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user.model';
import { AuthService } from '../auth.service';
import * as AuthActions from './auth.action';

// new interface to be used only here in this service: to set up shape of data coming back from signing up
// it is not required, but good practice in Angular
// properties are from firebase auth docs
export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(
        new Date().getTime() + +expiresIn * 1000
    );
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user)); // converts JS object into a string
    return new AuthActions.AuthenticateSuccess({ // pass an action: @Effect decorator makes ngrx dispatch action passed here auctomatically
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
    })
};

const handleError: any = (errorRes: HttpErrorResponse) => {
    // here we deal with error message (copied from auth.service.ts handleError function)
    let errorMessage = 'An unknown error occured !';
    if(!errorRes.error || !errorRes.error.error) {
        // return throwError(errorMessage);    // we cannot break observable chain, so we need to return one
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    // console.log(errorRes.error.error.message);
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already.';
            break;
        case 'INVALID_EMAIL':
            errorMessage = 'This email address invalid.';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email address was not found.';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
    }
    // more important we need to return observable so the whole authLogin observable continues to be alive
    return of(new AuthActions.AuthenticateFail(errorMessage))    // creates new observable without error, inside we should pass an action @Effect decorator makes ngrx dispatch action passed here auctomatically
};

@Injectable()   // it won't be injected itself, so we don't add as arg: {provided: 'root'}, but thing will be injected into this class
// to make it work:
// list this class in EffectsModule (after StoreModule) in app.module.ts
// dispatch login action - replace login with service in a auth.component.ts
export class AuthEffects {
    
    constructor(
        private actions$: Actions,   // there is convention to mark observables with '$', but it's not required
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap( (authData: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmd5KQQcyeRR0vw9I9idEk2DjUMYCy9p4',    // TODO: from previous parts: rebuild to extract API key to enviroment file
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn *1000)
                }),
                // for successful request
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    );
                }),
                // for non successful request
                catchError( (errorRes) => {
                    return handleError(errorRes);
                })
                
            )
        })    
    );

    @Effect()   
    authLogin = this.actions$.pipe(         // this is a stream of actions - observable that has to run all the time app is alive, so it can react to actions
        ofType(AuthActions.LOGIN_START),    // allows to filter which action in this chain of observables we want to deal with - only continue in this observable chain if the action is of given type; we can add multiple types of actions if the same code should be run
        switchMap((authData: AuthActions.LoginStart) => { // switchMap creates Observable by taking another observable's data
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmd5KQQcyeRR0vw9I9idEk2DjUMYCy9p4',    // TODO: from previous parts: rebuild to extract API key to enviroment file
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    // this.authService.setLogoutTimer(+resData.expiresIn) // for test autologout after 3.6 seconds
                    this.authService.setLogoutTimer(+resData.expiresIn *1000)
                }),
                // for successful request
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    );
                }),
                // for non successful request
                catchError(errorRes => {
                    return handleError(errorRes);
                })
                
            )
        }) // if the http request finish with error, the whole authLogin observable would die, and it cannot, cause we would be able to login again, we need to return non error obsevable,
            // even when error occurs - we need to catch error deeper inside = at http observable
    );      // no need to subscribe - ngrx does it automatically

    @Effect({dispatch: false})  //  getting error: platform-browser.js:1980 Throttling navigation to prevent the browser from hanging. See https://crbug.com/882238. Command line switch --disable-ipc-flooding-protection can be used to bypass the protection
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap( () => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
    })
    )

    // navigation after successful login can be handled here in ngrx effects - it's a side effect as it doesn't influance data of app
    @Effect({dispatch: false})   // if an effect doesn't (as typically it is) dispatch action @Effect decorator needs to be given an argument
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap( () => {
            this.router.navigate(['/']) // TODO: auth.guard doesn't work - when log out while in /recipes - it doesn't redirect to /auth route, it stays in recipes - it's because of the rece between effect and reducer
                                        // to avoid that redirect after logout is moved to separate logout effect
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map( () => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));  // convert string back to JS object, but NOT to our User model (no getter token() e.g.)
            
            if(!userData) {
                return { type: 'dummyType' };    // effect needs to return action - we simulate it with literal with poperty 'type'
            }
            // create new User to be able to use getter: token() - it checks if token is still valid
            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );
            
            // if user token is valid emit it
            if(loadedUser.token) {
                // for autologout after token expires - need to calculate, cause token was issued earlier and it's closer to expire datetime
                const expireInMiliseconds = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expireInMiliseconds);
                // return action and ngRx effects will dispatch it
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate)
                });
            }
            return { type: 'dummyType' };    // effect needs to return action - we simulate it with literal with poperty 'type'
        })
    )
    
}