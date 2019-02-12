"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var billy_core_1 = require("@fivethree/billy-core");
var markdown = require("markdown").markdown;
var Markdown = /** @class */ (function () {
    function Markdown() {
    }
    Markdown.prototype.headerH1 = function (content) {
        return this.header(1) + " " + content;
        ;
    };
    Markdown.prototype.headerH2 = function (content) {
        return this.header(2) + " " + content;
    };
    Markdown.prototype.headerH3 = function (content) {
        return this.header(3) + " " + content;
    };
    Markdown.prototype.headerH4 = function (content) {
        return this.header(4) + " " + content;
    };
    Markdown.prototype.headerH5 = function (content) {
        return this.header(5) + " " + content;
    };
    Markdown.prototype.headerH6 = function (content) {
        return this.header(6) + " " + content;
    };
    Markdown.prototype.createTable = function (headers, rows) {
        var _this = this;
        var content = [];
        var titles = headers.map(function (header) { return header.title; });
        this.addContent(content, titles.join('|'));
        var headerSeparator = headers.map(function (header) {
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
        rows.forEach(function (row) {
            var rowValues = headers.map(function (header) { return row[header.key]; });
            _this.addContent(content, rowValues.join('|'));
        });
        return this.joinContent(content);
    };
    Markdown.prototype.joinContent = function (content) {
        return content.join('\n');
    };
    Markdown.prototype.addContent = function (content, newContent) {
        content.push(newContent);
        return content;
    };
    Markdown.prototype.header = function (counter) {
        return '#'.repeat(counter);
    };
    Markdown.prototype.markdownToHTML = function (content) {
        console.log(content);
        return markdown.toHTML(content);
    };
    __decorate([
        billy_core_1.Action('H1 Header')
    ], Markdown.prototype, "headerH1", null);
    __decorate([
        billy_core_1.Action('H2 Header')
    ], Markdown.prototype, "headerH2", null);
    __decorate([
        billy_core_1.Action('H3 Header')
    ], Markdown.prototype, "headerH3", null);
    __decorate([
        billy_core_1.Action('H4 Header')
    ], Markdown.prototype, "headerH4", null);
    __decorate([
        billy_core_1.Action('H5 Header')
    ], Markdown.prototype, "headerH5", null);
    __decorate([
        billy_core_1.Action('H6 Header')
    ], Markdown.prototype, "headerH6", null);
    __decorate([
        billy_core_1.Action('Table')
    ], Markdown.prototype, "createTable", null);
    __decorate([
        billy_core_1.Action('Join Content')
    ], Markdown.prototype, "joinContent", null);
    __decorate([
        billy_core_1.Action('Add content')
    ], Markdown.prototype, "addContent", null);
    __decorate([
        billy_core_1.Action('Hello World')
    ], Markdown.prototype, "markdownToHTML", null);
    Markdown = __decorate([
        billy_core_1.Plugin('markdown')
    ], Markdown);
    return Markdown;
}());
exports.Markdown = Markdown;
var TableHeader = /** @class */ (function () {
    function TableHeader() {
    }
    return TableHeader;
}());
exports.TableHeader = TableHeader;
