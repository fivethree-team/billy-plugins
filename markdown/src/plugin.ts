import { Plugin, Action } from '@fivethree/billy-core';
import {
    MarkdownTableHeader,
    MdBuilderOptions,
    MarkdownBuilderOptions,
    mdOptionsFactory,
    HeaderLevel
} from './symbols';
const markdown = require("markdown").markdown;

@Plugin('markdown')
export class Markdown {

    @Action('Markdown Builder')
    createMdBuilder(options?: MdBuilderOptions): MarkdownBuilder {
        return new MarkdownBuilder(this, options);
    }

    @Action('H? Header')
    mdH(level: HeaderLevel, title: string): string {
        return `${this.header(level)} ${title}`;;
    }

    @Action('H1 Header')
    mdH1(title: string): string {
        return `${this.header(1)} ${title}`;;
    }

    @Action('H2 Header')
    mdH2(title: string): string {
        return `${this.header(2)} ${title}`;
    }

    @Action('H3 Header')
    mdH3(title: string): string {
        return `${this.header(3)} ${title}`;
    }

    @Action('H4 Header')
    mdH4(title: string): string {
        return `${this.header(4)} ${title}`;
    }

    @Action('H5 Header')
    mdH5(title: string): string {
        return `${this.header(5)} ${title}`;
    }

    @Action('H6 Header')
    mdH6(title: string): string {
        return `${this.header(6)} ${title}`;
    }

    @Action('List')
    list(level: number, content: string): string {
        return `${this.listLevel(level)}* ${content}`;
    }

    private listLevel(level: number): string {
        return level === 0 ? '' : '  '.repeat(level)
    }

    @Action('Url')
    mdUrl(url: string, text: string = url): string {
        return `[${text}](${url})`;
    }

    @Action('Header Url')
    mdHeaderUrl(header: string): string {
        return `[${header}](#${header.replace(' ', '-').toLowerCase()})`;
    }

    @Action('Comment')
    mdComment(comment: string): string {
        return `<!-- ${comment} -->`;
    }
    @Action('Text')
    mdText(text: string): string {
        return text;
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

    private header(level: HeaderLevel): string {
        return '#'.repeat(level);
    }

    @Action('Hello World')
    mdToHTML(content: string): string {
        return markdown.toHTML(content);
    }

}

export class MarkdownBuilder {

    private options: MarkdownBuilderOptions;
    private tableOfContent: string[];
    private mdContent: string[];

    constructor(private md: Markdown, private mdOptions: MdBuilderOptions = {}) {
        this.tableOfContent = [];
        this.mdContent = [];
        this.options = mdOptionsFactory(mdOptions);
    }

    private addContent(content: string) {
        this.mdContent.push(content);
    }

    private addToTableOfContent(level: HeaderLevel, title: string, addToTableOfContent: boolean) {
        if (addToTableOfContent) {
            this.tableOfContent.push(this.md.list(level - 1, this.md.mdHeaderUrl(title)));
        }
    }


    h(level: HeaderLevel, title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.addToTableOfContent(level, title, addToTableOfContent);
        this.addContent(this.md.mdH(level, title))
        return this;
    }

    h1(title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.h(1, title, addToTableOfContent);
        return this;
    }

    h2(title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.h(2, title, addToTableOfContent);
        return this;
    }

    h3(title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.h(3, title, addToTableOfContent);
        return this;
    }

    h4(title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.h(4, title, addToTableOfContent);
        return this;
    }

    h5(title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.h(5, title, addToTableOfContent);
        return this;
    }

    h6(title: string, addToTableOfContent?: boolean): MarkdownBuilder {
        this.h(6, title, addToTableOfContent);
        return this;
    }

    comment(comment: string): MarkdownBuilder {
        this.addContent(this.md.mdComment(comment));
        return this;
    }

    text(text: string): MarkdownBuilder {
        this.addContent(this.md.mdText(text));
        return this;
    }

    lineBreak(): MarkdownBuilder {
        this.addContent('');
        return this;
    }

    table(headers: MarkdownTableHeader[], rows: any[]): MarkdownBuilder {
        this.addContent(this.md.mdTable(headers, rows));
        return this;
    }

    private tableOfContentHeader(): string {
        return this.md.mdH(this.options.tableOfContentHeaderLevel, this.options.tableOfContentTitle);
    }

    buildTableOfContent(): string {
        this.tableOfContent.unshift(this.tableOfContentHeader());
        return this.md.mdJoinContent(this.tableOfContent);
    }

    private addAutoGeneratedComment() {
        if (this.options.hasAutoGeneratedComment) {
            this.mdContent.unshift('');
            this.mdContent.unshift(this.md.mdComment(this.options.autoGeneratedComment));
        }
    }

    // TODO add param with tableOfContent
    build(): string {
        this.mdContent.unshift(this.buildTableOfContent());
        this.addAutoGeneratedComment();
        return this.md.mdJoinContent(this.mdContent);
    }
}

