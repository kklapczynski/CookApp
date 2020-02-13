import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {

  // @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  // @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;

  @ViewChild('f', {'static': false}) form: NgForm;
  shoppingListItemIndexSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  editedItemIndex: number;

  constructor(private shoppingService: ShoppingService, private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }

  ngOnInit() {
    this.shoppingListItemIndexSubscription = this.shoppingService.shoppingListItemIndex.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingService.getIngredient(index);
        this.form.setValue( {
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        });
      }
    )
  }

  ngOnDestroy() {
    this.shoppingListItemIndexSubscription.unsubscribe();
  }

  onSubmit(f: NgForm) {
    const formValues = f.value;
    const newIngredient = new Ingredient(formValues.name, formValues.amount);
    if(this.editMode) {
      // this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({index: this.editedItemIndex, ingredient: newIngredient}))
    } else {
      // this.shoppingService.addIngredient(newIngredient); // after setup of getting data in shopping-list component from store, changing data in shoppingService won't have effect
      // here we dispatch action
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    f.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    // this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex))
    this.onClear();
  }
}
