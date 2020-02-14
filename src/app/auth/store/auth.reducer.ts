import { User } from '../user.model';

// define shape of state of 'auth' part of app's state for injecting the store
export interface State {
    user: User;
}

const initialState = {
    user: null              // this is a property from auth.service.ts, that is used across the app -> good to keep in store
}

export function authReducer(state = initialState, action) {
    return state;    
}