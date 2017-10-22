'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ServerModel} from './server-model';
import {HackShareBroadcaster} from './broadcaster';

import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const serverURL = 'http://localhost:3000'
const server = new ServerModel(serverURL);
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const config = vscode.workspace.getConfiguration('vs-share');

    if (config.get('server') === null) {
        vscode.window.showErrorMessage('vs-share.server setting not specified');
        return;
    }

    const broadcaster = new HackShareBroadcaster(config.get('server'));
    context.subscriptions.push(broadcaster);

    context.subscriptions.push(
        vscode.commands.registerCommand('vs-share.broadcast', () => broadcaster.start())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('vs-share.stop', () => broadcaster.stop())
    );


}

// this method is called when your extension is deactivated
export function deactivate() {
}