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
    async generateReadme() {

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

    @Lane('Publish @fivethree/billy-plugin-markdown')
    async publishMarkdownPlugin() {
        await this.updatePluginVersion('../markdown');
        await this.publishPlugin('../markdown');
    }

    private async publishPlugin(path: string) {
        await this.exec(`cd ${path} && npm run build && npm publish`, true);
    }

    private async updatePluginVersion(path: string) {
        const answer = await this.prompt([
            {
                type: 'list',
                name: 'update',
                message: 'Which version do you want to update the Markdown Plugin too?',
                choices: [
                    { name: 'Patch', value: 0 },
                    { name: 'Minor', value: 1 },
                ]
            }
        ]);

        switch (answer.update) {
            case 0:
                await this.exec(`cd ${path} && npm version patch`, true);
                break;
            case 1:
                await this.exec(`cd ${path} && npm version minor`, true);
                break;
        }
    }
}



