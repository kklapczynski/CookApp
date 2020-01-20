import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {

  // @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  // @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;

  @ViewChild('f', {'static': false}) formRef: NgForm;
  shoppingListItemIndexSubscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingListItemIndexSubscription = this.shoppingService.shoppingListItemIndex.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItem = this.shoppingService.getIngredient(index);
        this.formRef.setValue( {
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        });
      }
    )
  }

  ngOnDestroy() {
    this.shoppingListItemIndexSubscription.unsubscribe();
  }


  // addNewIngredient() {
  //   this.shoppingService.addIngredient(this.createNewIngredient());
  // }

  // createNewIngredient() {
  //   return new Ingredient(this.getNameInput(), this.getAmountInput());
  // }

  // getNameInput(): string {
  //   return this.nameInputRef.nativeElement.value;
  // }

  // getAmountInput(): number {
  //   return this.amountInputRef.nativeElement.value;
  // }

  onAdditem(f: NgForm) {
    const formValues = f.value;
    const newIngredient = new Ingredient(formValues.name, formValues.amount);
    this.shoppingService.addIngredient(newIngredient);
  }
  
}
