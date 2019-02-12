import { Plugin, Action } from '@fivethree/billy-core';
const markdown = require("markdown").markdown;

@Plugin('markdown')
export class Markdown {

    @Action('H1 Header')
    headerH1(content: string): string {
        return `${this.header(1)} ${content}`;;
    }

    @Action('H2 Header')
    headerH2(content: string): string {
        return `${this.header(2)} ${content}`;
    }

    @Action('H3 Header')
    headerH3(content: string): string {
        return `${this.header(3)} ${content}`;
    }

    @Action('H4 Header')
    headerH4(content: string): string {
        return `${this.header(4)} ${content}`;
    }

    @Action('H5 Header')
    headerH5(content: string): string {
        return `${this.header(5)} ${content}`;
    }

    @Action('H6 Header')
    headerH6(content: string): string {
        return `${this.header(6)} ${content}`;
    }

    @Action('Table')
    createTable(headers: TableHeader[], rows: any[]) {
        const content: string[] = [];

        const titles = headers.map(header => header.title);
        this.addContent(content, titles.join('|'));

        const headerSeparator = headers.map(header => {
            switch (header.alignment) {
                case 'left':
                    return ':---';
                case 'right':
                    return '---:';
                case 'centered':
                    return ':---:';
                default:
                    return '---';
            }
        });
        this.addContent(content, headerSeparator.join('|'));

        rows.forEach(row => {
            const rowValues = headers.map(header => row[header.key]);
            this.addContent(content, rowValues.join('|'));
        });

        return this.joinContent(content);
    }

    @Action('Join Content')
    joinContent(content: string[]): string {
        return content.join('\n');
    }

    @Action('Add content')
    addContent(content: string[], newContent): string[] {
        content.push(newContent);
        return content;
    }

    private header(counter: number): string {
        return '#'.repeat(counter);
    }

    @Action('Hello World')
    markdownToHTML(content: string): string {
        console.log(content);
        return markdown.toHTML(content);
    }

}

export class TableHeader {
    key: string;
    title: string;
    alignment?: Alignment;
}

export type Alignment = 'centered' | 'right' | 'left';