import { Plugin, Action } from '@fivethree/billy-core';
const axios = require('axios');
const ngrok = require('ngrok');

@Plugin('Create a ngrok tunnel for your webhooks')
export class NgrokPlugin {

    @Action('create ngrok tunnel')
    async tunnel(port = 7777) {
        if (new Util().tunnelOK()) {
            try {
                const url = await ngrok.connect({ authtoken: process.env.NGROK_AUTH_TOKEN, addr: port });
                return url;
            } catch (err) {
                console.log(err);
            };

        } else {
            const current = {
                NGROK_AUTH_TOKEN: process.env.NGROK_AUTH_TOKEN || 'not yet set',
            }
            console.log('Current Variables: ', JSON.stringify(current, null, 4));
            console.log('get your keys here: ', "https://ngrok.com")
            throw new Error('[NGROK Plugin] Prerequisites not met. Add missing environment variables in your .env file!')
        }
    }
}

class Util {

    tunnelOK(): boolean {
        return !!process.env.NGROK_AUTH_TOKEN;
    }
}