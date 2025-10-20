import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {triangle,ellipse,square,calendar,calendarOutline,people,peopleOutline,person,personOutline,menu,menuOutline,location,
  locationOutline,swapHorizontal,time,timeOutline,heart,heartOutline,checkmarkCircle,checkmarkCircleOutline,shield,shieldCheckmark,
  bag,bagOutline,card,cardOutline,search,airplane,home,homeOutline} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({triangle,ellipse,square,calendar,calendarOutline,people,peopleOutline,person,personOutline,menu,menuOutline,location,
      locationOutline,swapHorizontal,time,timeOutline,heart,heartOutline,checkmarkCircle,checkmarkCircleOutline,shield,shieldCheckmark,
      bag,bagOutline, card,cardOutline,search,airplane,home,homeOutline});
  }
}
