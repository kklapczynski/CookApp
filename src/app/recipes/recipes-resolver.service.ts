import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
    providedIn: 'root'
})

// this resolver runs before chosen route is loaded (see app-routing.module.ts) to ensure that data needed for route component is available
// it removes a bug when refreshing site in edit or details route

export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.dataStorageService.fetchRecipes();  // no subscribe here cause angular resolver does it
    }
}