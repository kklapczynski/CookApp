import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CookApp';
  isRecipesActive: boolean = true;

  isRecipes(isRecipes: boolean) {
    if(isRecipes != this.isRecipesActive) this.toggleRecipes();
  }

  toggleRecipes() {
    return this.isRecipesActive = !this.isRecipesActive;
  }
}
