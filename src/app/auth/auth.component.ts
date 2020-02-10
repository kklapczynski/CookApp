import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        if(form.invalid) return;

        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;

        let authObs: Observable<AuthResponseData>;

        if(this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
            
        }

        authObs.subscribe(
            responsedata => {
                console.log(responsedata);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            }
        )
        
        form.reset();
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
}