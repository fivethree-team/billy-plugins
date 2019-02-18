import { Plugin, Action } from '@fivethree/billy-core';
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path')
@Plugin('Docx plugin')
export class DocxPlugin {


    @Action('fillDocxTemplateWithJSON')
    async fillDocx(template: string, contents: any, outputPath: string, outputName: string) {
        const content = fs.readFileSync(path.resolve(template), 'binary');
        const zip = new JSZip(content);

        const doc = new Docxtemplater();
        doc.loadZip(zip);

        doc.setData(contents);


        try {
            // render the document
            doc.render();
        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties
            };
            console.log(JSON.stringify({ error: e }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        var buf = doc.getZip()
            .generate({ type: 'nodebuffer' });

        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(path.resolve(outputPath, outputName + '.docx'), buf);
    }

}