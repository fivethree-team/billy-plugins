"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const billy_core_1 = require("@fivethree/billy-core");
const application_1 = require("./generated/application");
const a = {
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
let Billy = class Billy extends application_1.Application {
    generate_readme() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(Object.keys(a).map(key => a[key]));
            const headers = [
                {
                    key: 'prefix', title: 'Snippet'
                },
                {
                    key: 'description', title: 'Purpose'
                }
            ];
            const table = this.createTable(headers, Object.keys(a).map(key => a[key]));
            // const markdown = this.markdownToHTML("Hello *Gary*!");
            this.writeText('./readme.md', table);
        });
    }
};
__decorate([
    billy_core_1.Lane('This is an example lane.\nThe only thing it really does is output Hello World! 👾'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Billy.prototype, "generate_readme", null);
Billy = __decorate([
    billy_core_1.App()
], Billy);
exports.Billy = Billy;
