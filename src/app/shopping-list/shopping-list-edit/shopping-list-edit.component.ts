import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppinglist from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {

  // @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  // @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;

  @ViewChild('f', {'static': false}) form: NgForm;
  // shoppingListItemIndexSubscription: Subscription;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  editedItemIndex: number;

  constructor(private shoppingService: ShoppingService, private store: Store<fromShoppinglist.AppState>) { }

  ngOnInit() {
    // TODO: replace subscription to service with one to store
    // this.shoppingListItemIndexSubscription = this.shoppingService.shoppingListItemIndex.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.shoppingService.getIngredient(index);  // TODO: need to get ingredient from store instead of service
    //     this.form.setValue( {
    //       'name': this.editedItem.name,
    //       'amount': this.editedItem.amount
    //     });
    //   }
    // )
    this.subscription = this.store.select('shoppingList').subscribe( stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        // this.editedItemIndex = stateData.editedIngredientIndex;
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
    // this.shoppingListItemIndexSubscription.unsubscribe();
    this.subscription.unsubscribe();
    // to reset state of editing to default when we leave component while editing
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(f: NgForm) {
    const formValues = f.value;
    const newIngredient = new Ingredient(formValues.name, formValues.amount);
    if(this.editMode) {
      // this.shoppingService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
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
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear();
  }
}
