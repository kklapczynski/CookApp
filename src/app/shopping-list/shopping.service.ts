import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class ShoppingService{
    ingredientsChanged = new Subject<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    constructor() {}

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

    
}