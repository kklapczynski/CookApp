import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RecipesDetailsComponent } from './recipes/recipes-details/recipes-details.component';
import { SelectRecipeComponent } from './recipes/select-recipe/select-recipe.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipesComponent, children: [
        { path: '', component: SelectRecipeComponent},
        { path: 'new', component: RecipeEditComponent}, // this path has to be before path with parameter, otherwise 'new' is treated as a dynamic cparameter
        { path: ':name', component: RecipesDetailsComponent},  // detail component with usage of name property of recipe rather then id
        // { path: ':id', component: RecipesDetailsComponent},  // this is used in course solution branch
        { path: ':id/edit', component: RecipeEditComponent}

        
        // {path: '**', component: SelectRecipeComponent}   path with stars would be needed when this default component was not passed as a first path
    ] },
    { path: 'shopping', component: ShoppingListComponent },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {}