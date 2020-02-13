import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// good practice to secure against typos
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

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

    constructor(public payload: number) {}
}
export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: {index: number, ingredient: Ingredient}) {}
}
