import { Component } from '@angular/core';
import { PushNotificationsService } from './service/push.notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PushNotificationsService],
})
export class AppComponent {
  public title: string = 'Drink Water Notifications!';

  constructor(private _notificationService: PushNotificationsService) {
    this._notificationService.requestPermission();
  }

  ngOnInit() {
    setInterval(() => {
      this.notify();
    }, 1800000);
    //1800000
  }

  isEnabled() {
    return Notification.permission == 'granted' ? true : false;
  }

  request() {
    this._notificationService.requestPermission();
  }

  notify() {
    let data: Array<any> = [];
    data.push({
      title: `My dear friend please drink Water`,
      tag: 'tag_1',
      alertContent: '🥤 Drinking water is essential to a healthy lifestyle',
      icon: 'assets/drinking-water.png',
    });
    this._notificationService.generateNotification(data);
  }
}
