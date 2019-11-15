import { Component } from "@angular/core";
import { Recipe } from './recipe.model';


@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss']
})

export class RecipesComponent {
    selectedRecipe: Recipe;

    onSelectedRecipe(recipe: Recipe) {
        // console.log(`Recipes Component: selectedrecipe received`);
        // console.log(recipe);
        this.selectedRecipe = recipe;
    }
}