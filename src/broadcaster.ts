import * as vscode from 'vscode';
import {ServerModel} from './server-model';


export class HackShareBroadcaster implements vscode.Disposable {

    textChangeWatch: vscode.Disposable = null;
    textOpenWatch: vscode.Disposable = null;

    server: ServerModel;

    constructor(serverUrl: string) {
        this.server = new ServerModel(serverUrl);
    }

    start() {
        vscode.workspace.textDocuments.map(d => this.server.sendTextDocument(d) );

        this.textChangeWatch = vscode.workspace.onDidChangeTextDocument(e => this.server.textDocumentChange(e));
        this.textOpenWatch = vscode.workspace.onDidOpenTextDocument(d => this.server.sendTextDocument(d));
    }

    stop() {
        this.dispose();
    }


    dispose() {
        if (this.textChangeWatch) {
            this.textChangeWatch.dispose();
            this.textChangeWatch = null;
        }
        if (this.textOpenWatch) {
            this.textOpenWatch.dispose();
            this.textOpenWatch = null;
        }
    }

}