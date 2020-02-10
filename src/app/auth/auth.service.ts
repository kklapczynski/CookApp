import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
export class AuthService{
    constructor(private http: HttpClient) {}

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
            catchError(this.handleError)
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
            catchError(this.handleError)
        );
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
}