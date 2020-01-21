import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipesService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
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
              'ingredientName': new FormControl(ingredient.name),
              'ingredientAmount': new FormControl(ingredient.amount)
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(editedName),
      'imagePath': new FormControl(editedImagePath) ,
      'description': new FormControl(editedDescription),
      'ingredients': editedIngredients
    });
  }

  onSubmit() {
    console.log(this.recipeForm);
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
}
