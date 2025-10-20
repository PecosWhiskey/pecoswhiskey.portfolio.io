import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// Importa addIcons e le icone necessarie
import { addIcons } from 'ionicons';
import {
  homeOutline, home, searchOutline, search,
  personOutline, person, menuOutline, airplaneOutline, airplane,
  locationOutline, location, swapHorizontalOutline, swapHorizontal,
  calendarOutline, calendar, peopleOutline,
  checkmarkCircleOutline, bagOutline, cardOutline,
  shieldCheckmarkOutline, shieldCheckmark, timeOutline, time,
  heartOutline, heart,
} from 'ionicons/icons';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // Registra tutte le icone necessarie
    addIcons({
      'home': home,
      'home-outline': homeOutline,
      'search': search,
      'search-outline': searchOutline,
      'person': person,
      'person-outline': personOutline,
      'menu-outline': menuOutline,
      'airplane': airplane,
      'airplane-outline': airplaneOutline,
      'location': location,
      'location-outline': locationOutline,
      'swap-horizontal': swapHorizontal,
      'swap-horizontal-outline': swapHorizontalOutline,
      'calendar': calendar,
      'calendar-outline': calendarOutline,
      'people-outline': peopleOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'bag-outline': bagOutline,
      'card-outline': cardOutline,
      'shield-checkmark': shieldCheckmark,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'time': time,
      'time-outline': timeOutline,
      'heart': heart,
      'heart-outline': heartOutline
    });
  }
}
