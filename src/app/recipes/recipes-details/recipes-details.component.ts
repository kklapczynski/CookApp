import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.scss']
})
export class RecipesDetailsComponent implements OnInit {

  recipe: Recipe;

  constructor(private recipesService: RecipesService, private route: ActivatedRoute) { }

  ngOnInit() {
    // subscribe to params to get name of recipe
    // set this.recipe using service
    this.route.params.subscribe(
      (params: Params) => {
        if (params['name'])
          this.recipe = this.recipesService.getRecipeByName(params['name']);
        if (params['id'])
          this.recipe = this.recipesService.getRecipeById(params['id']);
      }
    )
  }

  onToShoppingList() {
    this.recipesService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
}
