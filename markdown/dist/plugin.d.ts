export declare class Markdown {
    headerH1(content: string): string;
    headerH2(content: string): string;
    headerH3(content: string): string;
    headerH4(content: string): string;
    headerH5(content: string): string;
    headerH6(content: string): string;
    createTable(headers: TableHeader[], rows: any[]): string;
    joinContent(content: string[]): string;
    addContent(content: string[], newContent: any): string[];
    private header;
    markdownToHTML(content: string): string;
}
export declare class TableHeader {
    key: string;
    title: string;
    alignment?: Alignment;
}
export declare type Alignment = 'centered' | 'right' | 'left';
