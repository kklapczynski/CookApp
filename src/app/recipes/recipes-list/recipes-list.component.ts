import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {
  recipes: string[] = ['recipe_1','recipe_2','recipe_3','recipe_4'];
  
  constructor() { }

  ngOnInit() {
  }

}
