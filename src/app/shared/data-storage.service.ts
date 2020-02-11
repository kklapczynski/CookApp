import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private http: HttpClient, private recipesService: RecipesService, private authService: AuthService) {}

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        // Firebase provides endpoint to be used with 'put' method to send and replace data
        this.http.put(
            'https://ng-cookbook-4b5b5.firebaseio.com/recipes.json',
            recipes
        ).subscribe( response => console.log(response));
    }

    fetchRecipes() {
        // get user data: using take(number): take 1 latest value and unsubscribe after
        // use exhaustMap to fisrt subscribe and get user data to use it in http get method
        // exhaustMap takes data from previous observable and returns observable that replaces the first one in entire observable chain

        // token param attach is moved to AuthInterceptorService
        return this.http.get<Recipe[]>(
            'https://ng-cookbook-4b5b5.firebaseio.com/recipes.json'
        ).pipe(
            map(recipes => {                            // rxjs operator that transforms data stream
                return recipes.map( recipe => {         // needs to return recipes array of Recipe objects, for which js .map calls for each recipe object
                    return {                            // method returning the same object, but adding ingredients with existing values or with empty array - in case on database there is an object without 'ingredients property
                        ...recipe,  
                        ingredients: recipe.ingredients ? recipe.ingredients : []   // if there is 'ingredients' property from spreading: ...recipe it is replaced with new one, but here we give it the same values as they were
                    }
                })
            }),
            tap( recipes => {                               // tap allows to set recipes and subscribe somewhere else - in header component
                // console.log(recipes);
                this.recipesService.setRecipes(recipes)
            })
        )
    }
}