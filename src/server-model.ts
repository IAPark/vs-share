import * as sClient from 'socket.io-client';
import * as vscode from 'vscode';

export class ServerModel {
    socket: SocketIOClient.Socket;
    constructor(server: string) {
        this.socket = sClient(server);
    }

    sendFullFile(file: string, content: string, type: string) {
        this.socket.emit('file update', {file: file, content: content, type: type});
    }

    sendPartialUpdate(file: string, newContent: string, start: number, length: number) {
        console.log('sent');
        this.socket.emit('file change', {file: file, newContent, start, length});
    }

    textDocumentChange(event: vscode.TextDocumentChangeEvent) {
        var document = event.document;
        if (document.uri.scheme != 'file') return;
        console.log(document.uri);

        const path = vscode.workspace.asRelativePath(event.document.uri);
        event.contentChanges.forEach(e => {
            this.sendPartialUpdate(path, e.text, document.offsetAt(e.range.start), e.rangeLength);
        });
    }

    sendTextDocument(document: vscode.TextDocument) {
        if (document.uri.scheme != 'file') return;
        console.log(document.uri);
        const path = vscode.workspace.asRelativePath(document.uri);
        this.sendFullFile(path, document.getText(), document.languageId);
    }
}