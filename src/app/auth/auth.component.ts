import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService) {}

    onSubmit(form: NgForm) {
        if(form.invalid) return;

        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;

        if(this.isLoginMode) {
            // TODO
        } else {

            this.authService.signup(email, password).subscribe(
                responsedata => {
                    console.log(responsedata);
                    this.isLoading = false;
                },
                errorMessage => {
                    // console.log(errorMessage);
                    this.error = errorMessage;
                    this.isLoading = false;
                }
            )
        }
        
        form.reset();
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
}