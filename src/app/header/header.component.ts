import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  collapsed = true;

  constructor(private dataStoregeService: DataStorageService) { }

  ngOnInit() { }

  onSaveData() {
    this.dataStoregeService.storeRecipes();
  }

  onFetchData() {
    this.dataStoregeService.fetchRecipes().subscribe(); 
  }
}
