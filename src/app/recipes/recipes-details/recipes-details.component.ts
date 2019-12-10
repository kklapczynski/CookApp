import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.scss']
})
export class RecipesDetailsComponent implements OnInit {

  // @Input() recipe: Recipe;
  recipe: Recipe;

  constructor(private recipesService: RecipesService, private route: ActivatedRoute) { }

  ngOnInit() {
    // subscribe to params to get name of recipe
    // set this.recipe using service
    this.route.params.subscribe(
      (params: Params) => {
        this.recipe = this.recipesService.getRecipeByName(params['name']);
      }
    )
  }

  onToShoppingList() {
    this.recipesService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
}
