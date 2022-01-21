import * as vscode from 'vscode';
import { registerCommands } from 'lib/commands';
import { executeCommand } from 'lib/vscode';
import { commands, CommandsEnum } from 'modules/commands';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...registerCommands(commands));
}

export function deactivate() {
  executeCommand(CommandsEnum.destroy);
}
