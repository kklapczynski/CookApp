import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RecipesDetailsComponent } from './recipes/recipes-details/recipes-details.component';
import { SelectRecipeComponent } from './recipes/select-recipe/select-recipe.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipesComponent, children: [
        {path: '', component: SelectRecipeComponent},
        {path: ':name', component: RecipesDetailsComponent}
        // {path: '**', component: SelectRecipeComponent}   path with stars would be needed when not passed as a first path
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