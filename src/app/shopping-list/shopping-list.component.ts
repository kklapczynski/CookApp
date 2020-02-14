import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import {  Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAppStore from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})

export class ShoppingListComponent implements OnInit ,OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>; // ngrx store.select('name of part of store we need here') returns Observable, that we are saving in 'ingredients' property

  constructor(
    private store: Store<fromAppStore.AppState> // in Store<Type> we choose which part of store we are interested in: fromShoppingList.AppState holds app state as seen from this particular reducer file
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList'); // ngrx store.select('name of part of store we need here') returns Observable
    // above change to observable enforces change in template, where we looped through ingredients array -> (ingredients | async).ingredients ('async' is a pipe) : 
    // after resolving observable we get acces to ingredients array, that we can loop through
    // we can as well instead of async pipe use normal subscription and unsubscribe by hand is good practice then
  }

  editShoppingListItem(i:number) {
    // TODO: replace this emit to service with store dispatch action, so info about editing is in store - it then can be easier used accors whole app
    // TODO: need to change state of store in shopping-list.reducer.ts to do the above
    this.store.dispatch(new ShoppingListActions.StartEdit(i));
  }

  ngOnDestroy(): void {
  }
}
