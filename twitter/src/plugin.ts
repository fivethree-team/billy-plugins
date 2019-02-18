import { Plugin, Action } from '@fivethree/billy-core';
var Twitter = require('twitter');
@Plugin('twitter')
export class TwitterPlugin {

    @Action('tweet a message')
    async tweet(message) {

        if (new Util().envOK()) {
            const client = new Twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });

            return await client.post('statuses/update', { status: message });
        } else {
            const current = {
                TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY || 'not yet set',
                TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET || 'not yet set',
                TWITTER_ACCESS_TOKEN_KEY: process.env.TWITTER_ACCESS_TOKEN_KEY || 'not yet set',
                TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'not yet set'
            }
            console.log('Current Variables: ', JSON.stringify(current, null, 4));
            console.log('get your keys here: ', "https://apps.twitter.com/")
            throw new Error('[Twitter Plugin] Prerequisites not met. Add missing environment variables in your .env file!')
        }
    }

}

class Util {

    envOK(): boolean {
        return !!process.env.TWITTER_CONSUMER_KEY && !!process.env.TWITTER_CONSUMER_SECRET && !!process.env.TWITTER_ACCESS_TOKEN_KEY && !!process.env.TWITTER_ACCESS_TOKEN_SECRET;
    }

}