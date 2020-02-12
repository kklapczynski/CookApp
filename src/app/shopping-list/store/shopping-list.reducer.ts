import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

// initial state as in shopping.service.ts as JS object
const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ]
};

// arguments state and action are passed in by ngRx
// state = initialState - if state is not passed then default state: initialState is used (JS) - only when ngRx is first time starting, then previous state is used
export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,    // spread operator here pulls all properites of state object and adds them to this new object - copy is done as per redux pattern
                ingredients: [...state.ingredients, action.payload]    // overwrites 'ingredients' property, but copy old ingredients first to keep them
            };
        default:            // this is for first time ngrx loads this reducer
            return state;   // we provide default=initial state of this part of store
    }
}