import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  newRecipeId: number;

  constructor(private route: ActivatedRoute, private recipeService: RecipesService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.recipeService.newRecipeId.subscribe(
      (newId: number) => this.newRecipeId = newId
    )
  }
  
  initForm() {
    let editedName = '';
    let editedImagePath = '';
    let editedDescription = '';
    let editedIngredients = new FormArray([]);
    
    if(this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      editedName = recipe.name;
      editedImagePath = recipe.imagePath;
      editedDescription = recipe.description;
      if(recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          editedIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(editedName, Validators.required),
      'imagePath': new FormControl(editedImagePath, Validators.required) ,
      'description': new FormControl(editedDescription, Validators.required),
      'ingredients': editedIngredients
    });
  }

  onSubmit() {
    // const editedRecipe = new Recipe(
    //   this.recipeForm.value.name,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath,
    //   this.recipeForm.value.ingredients
    // )
    if(this.editMode) {
      // this.recipeService.updateRecipe(this.id, editedRecipe)
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.router.navigate(['../'], {relativeTo: this.route});  // edited recipe id already in the route
    } else {
      // this.recipeService.addRecipe(editedRecipe);
      this.recipeService.addRecipe(this.recipeForm.value);
      // when new recipe is added (no id in route yet) navigate to its details view: id has to be added to the route
      this.router.navigate(['../', this.newRecipeId], {relativeTo: this.route});  
    }
  }

  // DONE: cancel button: clear form and navigate away
  onCancel() {
    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  // TODO: delete recipe - from dropdown list in recipe details

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl('', Validators.required),
        'amount': new FormControl(null,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }
}
