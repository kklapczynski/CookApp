import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { subscribeOn } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  collapsed = true;
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(private dataStoregeService: DataStorageService, private authService: AuthService) { }

  ngOnInit() { 
    this.userSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStoregeService.storeRecipes();
  }

  onFetchData() {
    this.dataStoregeService.fetchRecipes().subscribe(); 
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
