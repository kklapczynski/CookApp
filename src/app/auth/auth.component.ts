import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    isLoginMode = true; // we don't put it into state, cause it is used only in this component, not the entire app
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error) {
                console.log(this.error);
                // TODO: showErrorAlert() from previous parts of course
            }
        })
    }

    onSubmit(form: NgForm) {
        if(form.invalid) return;

        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;

        let authObs: Observable<AuthResponseData>;

        if(this.isLoginMode) {
            // authObs = this.authService.login(email, password);
            this.store.dispatch(new AuthActions.LoginStart({email: email, password: password})) // dispatch(Action) doesn't return observable = we cannot save it and subscribe to it as with authService method
        } else {
            authObs = this.authService.signup(email, password);
            
        }

        // authObs.subscribe(
        //     responsedata => {
        //         console.log(responsedata);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']);
        //     },
        //     errorMessage => {
        //         console.log(errorMessage);
        //         this.error = errorMessage;
        //         this.isLoading = false;
        //     }
        // )
        
        form.reset();
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
}