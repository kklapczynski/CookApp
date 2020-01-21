import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class ShoppingService {
    ingredientsChanged = new Subject<Ingredient[]>();
    shoppingListItemIndex = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    constructor() {}

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    emitIngredientsChanged() {
        this.ingredientsChanged.next(this.getIngredients());
    }

    addIngredient(newIngredient: Ingredient) {
        this.ingredients.push(newIngredient);
        this.emitIngredientsChanged();
    }

    addIngredients(ingredients: Ingredient[]) {
        // ingredients.forEach(ingr => this.addIngredient(ingr));
        this.ingredients.push(...ingredients);      // spread operator: spreads array to array item separeted by ","
        this.emitIngredientsChanged();
    }

    updateIngredient(index: number, updatedIngredient: Ingredient) {
        this.ingredients[index] = updatedIngredient;
        this.emitIngredientsChanged();
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.emitIngredientsChanged();
    }
}