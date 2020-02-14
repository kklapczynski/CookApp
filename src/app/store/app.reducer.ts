import  * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import  * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

// collection of substates of parts of app
export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
}

// create map of reducers to add it to StoreModule in app.module.ts
// its type in <> defines what will be result state type
export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer
};