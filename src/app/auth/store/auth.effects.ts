// ngrx effects is to integrate processes not immediately important to store (= they don't change state) - their results are, but not a process itself: async actions lika http calls, localStorage etc.
// these async processes could stay in services, but it's good practice to integrate them in ngrx

import { Actions, ofType, Effect } from '@ngrx/effects';    // observable of all dispatched actions (it's different object then Action from ngrx/store)
import * as AuthActions from './auth.action';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// copied from auth.service.ts - this will be rebuild later
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
    
    constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}   // there is convention to mark observables with '$', but it's not required

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
        }) // if the http request finish with error, the whole authLogin observable would die, and it cannot, cause we would be able tologin again, we need to return non error obsevable,
            // even when error occurs - we need to catch error deeper inside = at http observable
    );      // no need to subscribe - ngrx does it automatically

    // navigation after successful login can be handled here in ngrx effects - it's a side effect as it doesn't influance data of app
    @Effect({dispatch: false})   // if an effect doesn't (as typically it is) dispatch action @Effect decorator needs to be given an argument
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap( () => {
            this.router.navigate(['/'])
        })
    );
}