
import { Plugin, Action } from '@fivethree/billy-core';
const notifier = require('node-notifier');

@Plugin('notify')
export class NotifyPlugin {

    @Action('notify')
    notify(message: string | any) {
        if (typeof message === 'string') {
            notifier.notify({
                title: 'Notification',
                message: message
            })
        } else {
            notifier.notify(message);
        }
    }


}