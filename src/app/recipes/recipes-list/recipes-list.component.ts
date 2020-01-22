import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from "../recipe.model";
import { RecipesService } from '../recipes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSubscription: Subscription;
  
  constructor(private recipesService: RecipesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipesSubscription = this.recipesService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    )
    this.recipes = this.recipesService.getRecipes();
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});  // in master branch this is done much simpler - using routerLink in html
  }
}
