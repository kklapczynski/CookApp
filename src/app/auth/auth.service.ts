import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAppStore from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // BehaviorSubject works like Subject + subscriber can get immidiate access to previous value, even when subscribed later
    // so we can get access to currently active user even when we weren't subscribed when user was emitted
    // user = new BehaviorSubject<User>(null); // argument is a starting value - here User, but null is accepted when no start needed 
    private tokenExpirationTimer: any;  // to be able to cancel setTimout when login out manually

    constructor(private store: Store<fromAppStore.AppState>) {}

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout( () => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}