import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';    // new action for sending http request - to be dealt with using ngrx effects
export const LOGIN = '[Auth] Login';    // action types naming convention of ngRx
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
    readonly type = LOGIN;

    constructor(
        public payload: {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date
        }
    ) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string; password: string}) {}
}

export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;

    constructor(public payload: string){}
}

// union type of actions
export type AuthActions = Login | Logout | LoginStart | LoginFail;