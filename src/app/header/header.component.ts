import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Feature } from '../shared/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // allows to use Feature enum in template
  Feature = Feature;

  collapsed = true;
  
  @Output() selectedFeature = new EventEmitter<Feature>();

  constructor() { }

  ngOnInit() {
  }
  
  onSelect(feature: Feature) {
    return this.selectedFeature.emit(feature);
  }
}
