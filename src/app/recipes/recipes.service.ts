import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipesService {

    recipesChanged = new Subject<Recipe[]>();
    newRecipeId = new Subject<number>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Pancakes',
    //         'Salty or sweet pancakes',
    //         'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
    //         [
    //             new Ingredient('Milk', 1),
    //             new Ingredient('Flour', 1),
    //             new Ingredient('Egg', 2)
    //         ]),
    //     new Recipe(
    //         'Burger',
    //         'Mega tasty burger',
    //         'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
    //         [
    //             new Ingredient('Bread slice', 2),
    //             new Ingredient('Meat', 1),
    //             new Ingredient('Onion slice', 2)

    //         ])
    // ];

    private recipes: Recipe[] = [];
    constructor(private shoppingService: ShoppingService) {}

    getRecipeById(id: number) {
        return this.recipes[id];
    }

    // emit changed list of recipes - subscription to it in recipes-list
    emitRecipesChange() {
        this.recipesChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.emitRecipesChange();
    }
    
    getRecipes() {
        return this.recipes.slice();    // to have a copy of a recipe array instead of a reference
        // read: https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingService.addIngredients(ingredients);
    }

    addRecipe(newRecipe: Recipe) {
        this.recipes.push(newRecipe);
        this.newRecipeId.next(this.recipes.length-1);
        this.emitRecipesChange();
    }

    updateRecipe(index: number, editedRecipe: Recipe) {
        this.recipes[index] = editedRecipe;
        this.emitRecipesChange();
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index,1);
        this.emitRecipesChange();
    }
}