import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipesService } from './recipes.service';

@Injectable({
    providedIn: 'root'
})

// this resolver runs before chosen route is loaded (see app-routing.module.ts) to ensure that data needed for route component is available
// it removes a bug when refreshing site in edit or details route

export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, private recipesService: RecipesService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // to ensure that local changes - in app are not overwritten by data from firebase server (resolver runs and loads data each time route with resolver is accessed)
        // we need to check if there is data and ONLY when there is none load it
        const recipes = this.recipesService.getRecipes();
        if (recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();  // no subscribe here cause angular resolver does it
        } else {
            return recipes;
        }
        
    }
}