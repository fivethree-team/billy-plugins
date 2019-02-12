import { Plugin, Action } from '@fivethree/billy-core';
const markdown = require("markdown").markdown;

@Plugin('markdown')
export class Markdown {

    @Action('H1 Header')
    mdH1(content: string): string {
        return `${this.header(1)} ${content}`;;
    }

    @Action('H2 Header')
    mdH2(content: string): string {
        return `${this.header(2)} ${content}`;
    }

    @Action('H3 Header')
    mdH3(content: string): string {
        return `${this.header(3)} ${content}`;
    }

    @Action('H4 Header')
    mdH4(content: string): string {
        return `${this.header(4)} ${content}`;
    }

    @Action('H5 Header')
    mdH5(content: string): string {
        return `${this.header(5)} ${content}`;
    }

    @Action('H6 Header')
    mdH6(content: string): string {
        return `${this.header(6)} ${content}`;
    }

    @Action('Url')
    mdUrl(url: string, text: string = url): string {
        return `[${text}](${url})`;
    }

    @Action('Comment')
    mdComment(comment: string): string {
        return `<!-- ${comment} -->`;
    }

    @Action('Table')
    mdTable(headers: MarkdownTableHeader[], rows: any[]) {
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

        return this.mdJoinContent(content);
    }

    @Action('Join Content')
    mdJoinContent(content: string[]): string {
        return content.join('\n');
    }

    private addContent(content: string[], newContent): string[] {
        content.push(newContent);
        return content;
    }

    private header(counter: number): string {
        return '#'.repeat(counter);
    }

    @Action('Hello World')
    mdToHTML(content: string): string {
        return markdown.toHTML(content);
    }

}

export class MarkdownTableHeader {
    key: string;
    title: string;
    alignment?: MarkdownTableAlignment;
}

export type MarkdownTableAlignment = 'centered' | 'right' | 'left';