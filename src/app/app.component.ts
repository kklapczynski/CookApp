import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Feature } from './shared/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  // allows to use Feature enum in template
  Feature = Feature;

  title = 'CookApp';
  selectedFeature: Feature;

  ngOnInit() {
    if(!this.selectedFeature) this.selectedFeature = Feature.Recipes;
  }

  displayFeature(feature: string) {
    this.selectedFeature = Feature[feature];
  }
}
