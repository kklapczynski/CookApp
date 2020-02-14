import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

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

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // BehaviorSubject works like Subject + subscriber can get immidiate access to previous value, even when subscribed later
    // so we can get access to currently active user even when we weren't subscribed when user was emitted
    user = new BehaviorSubject<User>(null); // argument is a starting value - here User, but null is accepted when no start needed 
    private tokenExpirationTimer: any;  // to be able to cancel setTimout when login out manually

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        // firebase setup: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
        // API_KEY: firebase console - project setting: web api
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmd5KQQcyeRR0vw9I9idEk2DjUMYCy9p4',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe( 
            catchError(this.handleError),
            tap( resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmd5KQQcyeRR0vw9I9idEk2DjUMYCy9p4',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe( 
            catchError(this.handleError),
            tap( resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        // from Firebase docs in response: expiresIn 	string 	The number of seconds in which the ID token expires.
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email, 
            userId,
            token, 
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user)); // converts JS object into a string
    }

    // private method cause we use it only in this service
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured !';
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));  // convert string back to JS object, but NOT to our User model (no getter token() e.g.)
        
        if(!userData) {
            return;
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
            // autologout after token expires - need to calculate, cause token was issued earlier and it's closer to expire datetime
            const expireInMiliseconds = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expireInMiliseconds);
            this.user.next(loadedUser);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout( () => {
            this.logout();
        }, expirationDuration);
    }
}