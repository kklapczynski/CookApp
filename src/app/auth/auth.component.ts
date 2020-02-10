import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;

    constructor(private authService: AuthService) {}

    onSubmit(form: NgForm) {
        if(form.invalid) return;

        const email = form.value.email;
        const password = form.value.password;

        if(this.isLoginMode) {
            // TODO
        } else {

            this.authService.signup(email, password).subscribe(
                responsedata => {
                    console.log(responsedata);
                },
                error => {
                    console.log(error);
                }
            )
        }
        
        form.reset();
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
}