import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  
  @Output() isRecipes = new EventEmitter<boolean>();
  // @Output() isShoppingListChosenChosen = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }
  
  activateRecipes() {
    return this.isRecipes.emit(true);
  }

  activateShoppingList() {
    return this.isRecipes.emit(false);
  }
}
