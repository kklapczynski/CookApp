import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.scss']
})
export class ShoppingListEditComponent implements OnInit {

  @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;

  // to emit ingredient data to parent component - shopping-list
  @Output() newIngredient = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit() {
  }

  emitNewIngredient() {
    this.newIngredient.emit(this.createNewIngredient());
  }

  createNewIngredient() {
    return new Ingredient(this.getNameInput(), this.getAmountInput());
  }

  getNameInput(): string {
    return this.nameInputRef.nativeElement.value;
  }

  getAmountInput(): number {
    return this.amountInputRef.nativeElement.value;
  }

  
}
