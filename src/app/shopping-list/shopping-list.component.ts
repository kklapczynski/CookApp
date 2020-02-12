import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})

export class ShoppingListComponent implements OnInit ,OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>; // ngrx store.select('name of part of store we need here') returns Observable, that we are saving in 'ingredients' property
  // ingredientsChangedSubscription: Subscription;

  constructor(
    private shoppingService: ShoppingService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }> // in Store<Type> we choose which part of store we are interested in
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList'); // ngrx store.select('name of part of store we need here') returns Observable
    // above change to observable enforces change in template, where we looped through ingredients array -> (ingredients | async).ingredients ('async' is a pipe) : 
    // after resolving observable we get acces to ingredients array, that we can loop through
    // we can as well instead of async pipe use normal subscription and unsubscribe by hand is good practice then

    // thanks to above store use we can get rid of below code, store deals with subscriptions, so no need to unsubscribe anymore

    // this.ingredients = this.shoppingService.getIngredients();
    // this.ingredientsChangedSubscription = this.shoppingService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
  }

  editSchoppingListItem(i:number) {
    this.shoppingService.shoppingListItemIndex.next(i);
  }

  ngOnDestroy(): void {
    // this.ingredientsChangedSubscription.unsubscribe();
  }
}
