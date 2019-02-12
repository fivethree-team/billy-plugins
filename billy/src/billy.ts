import { App, Lane } from "@fivethree/billy-core";
import { Application } from "./generated/application";
import { TableHeader } from "@fivethree/billy-plugin-markdown/dist/plugin";

const a: any = {
    "ion-anchor": {
        "prefix": "i-anchor",
        "body": [
            "<ion-anchor href=\"${1:#}\" color=\"${2|primary,secondary,tertiary|}\">${3:Anchor}</ion-anchor>"
        ],
        "description": "<ion-anchor>"
    },
    "ion-app": {
        "prefix": "i-app",
        "body": [
            "<ion-app>",
            "</ion-app>"
        ],
        "description": "<ion-app>"
    }
};

@App()
export class Billy extends Application {

    @Lane('This is an example lane.\nThe only thing it really does is output Hello World! 👾')
    async generate_readme() {

        console.log(Object.keys(a).map(key => a[key]));

        const headers: TableHeader[] = [
            {
                key: 'prefix', title: 'Snippet'
            },
            {
                key: 'description', title: 'Purpose'
            }
        ]
        const table = this.createTable(headers, Object.keys(a).map(key => a[key]));

        // const markdown = this.markdownToHTML("Hello *Gary*!");
        this.writeText('./readme.md', table);
    }

}



