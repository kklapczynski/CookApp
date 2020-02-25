import { Action, ActionReducerMap } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';    // new action for sending http request - to be dealt with using ngrx effects
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';    // action types naming convention of ngRx
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string; password: string}) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: {email: string; password: string}) {}
}

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date
        }
    ) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;

    constructor(public payload: string){}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

// union type of actions
export type AuthActions = LoginStart | SignupStart | AuthenticateSuccess | AuthenticateFail | ClearError | AutoLogin | Logout;