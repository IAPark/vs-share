'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as sClient from 'socket.io-client';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const server = 'http://localhost:3000'

export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vs-share" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vs-share.broadcast', () => {
        const socket = sClient(server);
        socket.on('connect', () => {

        })
        vscode.window.showInformationMessage(`Your code is now being pushed to ${server}`);
        vscode.workspace.findFiles('**/*', '**/node_modules/**')
            .then(uris=>uris.forEach((uri) => fs.readFile(uri.fsPath, 'UTF-8', (err, data) => {
                onUpdate(vscode.workspace.asRelativePath(uri),
                         data, socket);
            }))
        );
        vscode.workspace.textDocuments.map(document=>onUpdate(vscode.workspace.asRelativePath(document.uri), document.getText(), socket));
        
        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument( 
                e => onUpdate(vscode.workspace.asRelativePath(e.document.uri), e.document.getText(), socket)
            )
        );
    });

    context.subscriptions.push(disposable);
}

function onUpdate(file: string, text: string, socket: SocketIOClient.Socket) {
    socket.emit('file update', {file: file, text: text});
    console.log('sent', file, text.substr(0, 10));
}

// this method is called when your extension is deactivated
export function deactivate() {
}