import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class PushNotificationsService {
    public permission: Permission;

    constructor() {
        this.permission = this.isSupported() ? 'default' : 'denied';
    }

    public isSupported(): boolean {
        return 'Notification' in window;
    }

    requestPermission(): void {
        let self = this;
        if ('Notification' in window) {
            Notification.requestPermission(function (status) {
                return (self.permission = status);
            });
        }
    }

    create(title: string, options?: PushNotification): any {
        let self = this;
        return new Observable(function (obs) {
            if (!('Notification' in window)) {
                console.log('Notifications are not available in this environment');
                obs.complete();
            }

            if (self.permission !== 'granted') {
                console.log(
                    "The user hasn't granted you permission to send push notifications"
                );
                obs.complete();
            }

            let _notify = new Notification(title, options);
            _notify.onshow = function (e) {
                // setTimeout(function() {
                //   _notify.close();
                // }, 7500);
                return obs.next({
                    notification: _notify,
                    event: e,
                });
            };

            _notify.onclick = function (e) {
                _notify.close();
                return obs.next({
                    notification: _notify,
                    event: e,
                });
            };

            _notify.onerror = function (e) {
                return obs.error({
                    notification: _notify,
                    event: e,
                });
            };

            _notify.onclose = function () {
                return obs.complete();
            };
        });
    }

    generateNotification(source: Array<any>): void {
        if (this.permission == 'granted') {
            source.forEach((item, i) => {
                let options = {
                    badge: item.badge,
                    body: item.alertContent,
                    icon: item.icon,
                    image: item.image,
                    tag: item.tag,
                    vibrate: [200, 100, 200],
                    requireInteraction: false,
                    sound:
                        'https://notificationsounds.com/storage/sounds/file-sounds-881-look-this-is-what-i-was-talking-about.mp3',
                };
                setTimeout(() => {
                    let ref = this.create(item.title, options).subscribe(() => {
                        // console.log("res", res);
                    });
                }, i * 3000);
            });
        }
    }
}

export declare type Permission = 'denied' | 'granted' | 'default';

export interface PushNotification {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    renotify?: boolean;
    silent?: boolean;
    sound?: string;
    noscreen?: boolean;
    sticky?: boolean;
    dir?: 'auto' | 'ltr' | 'rtl';
    lang?: string;
    vibrate?: number[];
}
