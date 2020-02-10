import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthComponent } from './auth.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// new interface to be used only here in this service: to set up shape of data coming back from signing up
// it is not required, but good practice in Angular
// properties are from firebase auth docs
interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
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
            catchError( errorRes => {
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
                }
                return throwError(errorMessage);
            })
        )
    }
}