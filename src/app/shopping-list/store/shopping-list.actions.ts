import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// good practice to secure against typos
export const ADD_INGREDIENT = '[Shopping List] Add Ingredient'; // action types naming convention of ngRx
export const ADD_INGREDIENTS = '[Shopping List] Ad Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

// use Typescript 'type' feature to enable multiple types - creates a union of all different action stypes we want to use
export type ShoppingListActions = AddIngredient | AddIngredients | DeleteIngredient | UpdateIngredient | StartEdit | StopEdit;


export class StartEdit implements Action {
    readonly type = START_EDIT;

    constructor(public payload: number) {}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
    // no payload needed here
}

// to describe action
export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT; // identifier of this action; 'readonly' - TypeScript feature - property must never be change from outside
    
    // payload: Ingredient;    // 'payload' is custom name - not enforced by anything

    // to be able to pass payload in object creation: new AddIngredient(payload) - in shopping-list-edit.component.ts
    constructor(public payload: Ingredient) {}     // payload is added as a public property of new object
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) {}
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}
export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) {}
}
