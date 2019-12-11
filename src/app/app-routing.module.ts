import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component';
import { RecipesDetailsComponent } from './recipes/recipes-details/recipes-details.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipesComponent, children: [
        { path: '', component: RecipesStartComponent }, // deafult when no recipe is chosen yet
        { path: ':id', component: RecipesDetailsComponent } // dynamic param id is set by [routerLink] on <a> tag of recipe-item
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