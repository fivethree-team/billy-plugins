import { CorePlugin } from '@fivethree/billy-plugin-core';
import { usesPlugins } from '@fivethree/billy-core';
import { Markdown } from '@fivethree/billy-plugin-markdown';
import { BillyDocsPlugin } from '@fivethree/billy-plugin-docs';
import { DocxPlugin } from '@fivethree/billy-plugin-docx';
import { GoogleApiPlugin } from '@fivethree/billy-plugin-google';
import { NgrokPlugin } from '@fivethree/billy-plugin-ngrok';
import { NotifyPlugin } from '@fivethree/billy-plugin-notify';
import { TelegramPlugin } from '@fivethree/billy-plugin-telegram';
import { TogglPlugin } from '@fivethree/billy-plugin-toggl';
import { TwitterPlugin } from '@fivethree/billy-plugin-twitter';

//we need this line for intellisense :)
export interface Plugins extends
    CorePlugin,
    Markdown,
    BillyDocsPlugin,
    DocxPlugin,
    GoogleApiPlugin,
    NgrokPlugin,
    NotifyPlugin,
    TelegramPlugin,
    TogglPlugin,
    TwitterPlugin 
    { }

export class Plugins {
    @usesPlugins(
        CorePlugin,
        Markdown,
        BillyDocsPlugin,
        DocxPlugin,
        GoogleApiPlugin,
        NgrokPlugin,
        NotifyPlugin,
        TelegramPlugin,
        TogglPlugin,
        TwitterPlugin
    ) this;
}
