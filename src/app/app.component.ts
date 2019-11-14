import { Component } from '@angular/core';
import { Feature } from './shared/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // allows to use Feature enum in template
  Feature = Feature;

  title = 'CookApp';
  selectedFeature: Feature = Feature.Recipes;

  displayFeature(feature: string) {
    this.selectedFeature = Feature[feature];
  }
}
