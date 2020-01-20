import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit {

  @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit() {
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
