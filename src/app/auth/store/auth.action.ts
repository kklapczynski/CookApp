import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';    // action types naming convention of ngRx
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

// union type of actions
export type AuthActions = Login | Logout;