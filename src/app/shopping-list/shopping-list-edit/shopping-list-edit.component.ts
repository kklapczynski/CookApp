import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppinglist from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {


  @ViewChild('f', {'static': false}) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  editedItemIndex: number;

  constructor(private store: Store<fromShoppinglist.AppState>) { }

  ngOnInit() {
    // TODO: replace subscription to service with one to store
    this.subscription = this.store.select('shoppingList').subscribe( stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.form.setValue( {
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // to reset state of editing to default when we leave component while editing
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(f: NgForm) {
    const formValues = f.value;
    const newIngredient = new Ingredient(formValues.name, formValues.amount);
    if(this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      // after setup of getting data in shopping-list component from store, changing data in  won't have effect - get rid of shoppingService alltogether
      // here we dispatch action
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    f.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear();
  }
}
