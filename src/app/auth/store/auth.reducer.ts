import { User } from '../user.model';
import * as AuthActions from './auth.action';

// define shape of state of 'auth' part of app's state for injecting the store
export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState = {
    user: null,              // this is a property from auth.service.ts, that is used across the app -> good to keep in store
    authError: null,
    loading: false
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.LOGIN:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            
            return {
                ...state,
                user: user,
                authError: null,
                loading: false
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }
        case AuthActions.LOGIN_START:
            return {
                ...state,
                authError: null,
                loading: true
            }
        case AuthActions.LOGIN_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            }
        default:            // neccessary to properly initialize state
            return state;   // it is IMPORTANT cause when store.dispatch(any action from any reducer) is called ALL reducers are called:
                            // chosen action matches only one in one of reducers, but default case is called in others - that is why it has to return state without changes
    }                       // this implicates as well actions types naming convention to avoid duplicates - in ...action.ts files
}