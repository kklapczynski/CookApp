import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.scss']
})
export class RecipesDetailsComponent implements OnInit {
  id: number;
  recipe: Recipe;

  constructor(private recipesService: RecipesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];  // "+" used to convert string to number
        // this.recipe = this.recipesService.getRecipeById(parseInt(params['id']));
        this.recipe = this.recipesService.getRecipeById(this.id);
      }
    )
  }

  onToShoppingList() {
    this.recipesService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    // this.router.navigate(['edit'], {relativeTo: this.route});  // simpler solution in master branch using routerLink in html
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route}); // this is just for demo purpose of building more complicated routes
  }

  onDeleteRecipe() {
    this.recipesService.deleteRecipe(this.id);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
