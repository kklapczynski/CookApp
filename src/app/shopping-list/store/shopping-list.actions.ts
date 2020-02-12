import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// good practice to secure against typos
export const ADD_INGREDIENT = 'ADD_INGREDIENT';

// to describe action
export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT; // identifier of this action; 'readonly' - TypeScript feature - property must never be change from outside
    // payload: Ingredient;    // 'payload' is custom name - not enforced by anything

    // to be able to pass payload in object creation: new AddIngredient(payload) - in shopping-list-edit.component.ts
    constructor(public payload: Ingredient) {}     // payload is added as a public property of new object
}