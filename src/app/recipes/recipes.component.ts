import { Component } from "@angular/core";
import { RecipesService } from './recipes.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss']//,
    // providers: [RecipesService]  // when service provided here an instance of it lives in recipe component, but when we leave it it is gone ... 
    // to prevent this it has to be provided in app.module level - then instance of it lives as long as app lives
})

export class RecipesComponent {}