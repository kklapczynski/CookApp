import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private http: HttpClient, private recipesService: RecipesService) {}

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        // Firebase provides endpoint to be used with 'put' method to send and replace data
        this.http.put(
            'https://ng-cookbook-4b5b5.firebaseio.com/recipes.json',
            recipes
        ).subscribe( response => console.log(response));
    }

    fetchRecipes() {
        this.http.get<Recipe[]>(
            'https://ng-cookbook-4b5b5.firebaseio.com/recipes.json'
        )
        .pipe(
            map(recipes => {                            // rxjs operator that transforms data stream
                return recipes.map( recipe => {         // needs to return recipes array of Recipe objects, for which js .map calls for each recipe object
                    return {                            // method returning the same object, but adding ingredients with existing values or with empty array - in case on database there is an object without 'ingredients property
                        ...recipe,  
                        ingredients: recipe.ingredients ? recipe.ingredients : []   // if there is 'ingredients' property from spreading: ...recipe it is replaced with new one, but here we give it the same values as they were
                    }
                })
            }))
        .subscribe( recipes => {
            console.log(recipes);
            this.recipesService.setRecipes(recipes);
        })
    }
}