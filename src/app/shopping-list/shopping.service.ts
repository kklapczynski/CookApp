import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()

export class ShoppingService{
    ingredientsChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    constructor() {}

    getIngredients() {
        return this.ingredients.slice();
    }

    emitIngredientsChanged() {
        this.ingredientsChanged.emit(this.getIngredients());
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

    
}