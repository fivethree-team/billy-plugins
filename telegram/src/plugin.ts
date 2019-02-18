import { Plugin, Action } from '@fivethree/billy-core';
// const Telegraf = require('telegraf')
import Telegraf from 'telegraf';

@Plugin('telegram bot')
export class TelegramPlugin {

    @Action('Hello World')
    telegram(): Telegraf<any> {
        if (new Util().envOK()) {
            return new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

        } else {
            const current = {
                TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'not yet set',
            }
            console.log('Current Variables: ', JSON.stringify(current, null, 4));
            console.log('get your bot token here: ', "https://telegram.me/BotFather")
            throw new Error('[Telegram Plugin] Prerequisites not met. Add missing environment variables in your .env file!')
        }
    }

}

class Util {

    envOK(): boolean {
        return !!process.env.TELEGRAM_BOT_TOKEN;
    }

}