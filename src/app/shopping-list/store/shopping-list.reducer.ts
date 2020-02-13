import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';



// define general state pattern=interface of shoppingList state - 'shoppingList' part of whole store - we list them in app.module.ts
// we can use it everywhere we inject Store to set its Type
export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

// define interface of whole app state, that holds all parts
export interface AppState {
    shoppingList: State
}

// initial state as in shopping.service.ts as JS object
const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,     // initial value: null, cause we are not editing any by default, only after click
    editedIngredientIndex: -1   // initial value: -1, cause this is not valid index number, will be replaced after click
};



// arguments state and action are passed in by ngRx
// state = initialState - if state is not passed then default state: initialState is used (JS) - only when ngRx is first time starting, then previous state is used
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,    // spread operator here pulls all properites of state object and adds them to this new object - copy is done as per redux pattern
                ingredients: [...state.ingredients, action.payload]    // overwrites 'ingredients' property, but copy old ingredients first to keep them
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }
        case ShoppingListActions.DELETE_INGREDIENT:
            
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, ingredientindex) => { return ingredientindex !== action.payload})    // filter returns new array, so rule of not modifying old state is kept
            }
        case ShoppingListActions.UPDATE_INGREDIENT:
            // get ingredient to update in current state
            const ingredient = state.ingredients[action.payload.index];
            // set ingredient to change - copy and modify
            const updatedIngredient = {
                ...ingredient,  // copy of all old properties of an ingredient - in case we don't overwrite all properties (culd be skipped here cause we are overwriting all props)
                ...action.payload.ingredient    // replace old properties of ingredient with new ones from action's payload
            };
            // copy array of ingredients where edited one has to be replaced
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;   // replace edited ingredient with its new values

            return {
                ...state,
                ingredients: updatedIngredients
            }
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                // editedIngredient: state.ingredients[action.payload] // WRONG: this is a reference to store sate ingredients array, so it would hold reference to ingredient in the old state
                editedIngredient: {...state.ingredients[action.payload]}     // here new object is created and spread runs on selected Ingredient: copies of its properties are properties of an newly created object and this object is a Ingredient, cause has all properties of it
            }
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex: -1,
                editedIngredient: null
            }
        default:            // this is for first time ngrx loads this reducer
            return state;   // we provide default=initial state of this part of store
    }
}