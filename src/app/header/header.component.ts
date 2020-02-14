import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromAppStore from '../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  collapsed = true;
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(
    private dataStoregeService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromAppStore.AppState>
  ) { }

  ngOnInit() { 
    // this.userSubscription = this.store.select('auth')
    // 1.version
    // .subscribe( authState => {
    //   this.isAuthenticated = !!authState.user;
    // });
    // 2.version
    // .pipe(map(authState => {return authState.user}))
    // .subscribe( user => {
    //   this.isAuthenticated = !!user;
    // });
    // 3.version
    this.userSubscription = this.store.select('auth','user').subscribe( user => {
        this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStoregeService.storeRecipes();
  }

  onFetchData() {
    this.dataStoregeService.fetchRecipes().subscribe(); 
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
