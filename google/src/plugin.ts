import { Plugin, Action } from '@fivethree/billy-core';
import { google } from 'googleapis';
import { existsSync, statSync, createReadStream } from 'fs';
const readline = require('readline');

@Plugin('plugin for google apis')
export class GoogleApiPlugin {

    @Action('Upload a file to GDRIVE')
    async uploadToGDrive(path: string) {
        if (!path || !existsSync(path)) {
            console.error('file not found', path);
            return;
        }

        const oauth2Client = new google.auth.OAuth2(
            "940340802381-c08n73hj89nnnqlgdjpsulpovrs69pr0.apps.googleusercontent.com",
            "Tr65nGypaj4-Lx51PZieS5-4",
            "urn:ietf:wg:oauth:2.0:oob"
        );

        // const scopes = [
        //     'https://www.googleapis.com/auth/drive'
        // ];

        // const url = oauth2Client.generateAuthUrl({
        //     // 'online' (default) or 'offline' (gets refresh_token)
        //     access_type: 'offline',

        //     // If you only need one scope you can pass it as a string
        //     scope: scopes
        // });

        const code = "4/0AAD-6f0rS5WuQiq9s3Rb-3utQyRV5vOVrYb6zxBzbehVivK1NKh250";
        const {tokens} = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens);
    
        const fileSize = statSync(path).size;
        const drive = google.drive(
            {
                version: 'v3',
                auth: oauth2Client
            }
        )

        const res = await drive.files.create(
            {
                requestBody: {
                    // a requestBody element is required if you want to use multipart
                },
                media: {
                    body: createReadStream(path),
                },
            },
            {
                // Use the `onUploadProgress` event from Axios to track the
                // number of bytes uploaded to this point.
                onUploadProgress: evt => {
                    const progress = (evt.bytesRead / fileSize) * 100;
                    readline.clearLine();
                    readline.cursorTo(0);
                    process.stdout.write(`${Math.round(progress)}% complete`);
                },
            }
        );
        console.log(res.data);
        return res.data;
    }
}