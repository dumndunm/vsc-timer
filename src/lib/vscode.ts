import * as vscode from 'vscode';
import type {
  CommandT,
  CommandsT,
  CommandTitlesEnum,
} from '../modules/commands';
import { CommandsEnum } from '../modules/commands';

const registerCommand = (
  command: CommandsEnum,
  callback: () => void,
): vscode.Disposable => {
  return vscode.commands.registerCommand(command, callback);
};

const executeCommand = (command: string): Thenable<undefined> => {
  return vscode.commands.executeCommand(command);
};

const showQuickPick = <T extends vscode.QuickPickItem>(
  items: Array<T>,
  options?: vscode.QuickPickOptions
): Thenable<T | undefined> => {
  return vscode.window.showQuickPick<T>(items, options);
};

const showInputBox = (
  placeHolder: string,
  validateInput: (input: string) => string | null
): Thenable<string | undefined> => {
  return vscode.window.showInputBox({ placeHolder, validateInput });
};

const showInformationMessage = <T extends vscode.MessageItem>(
  message: string,
  ...buttons: Array<T>
): Thenable<T | undefined> => {
  return vscode.window.showInformationMessage<T>(message, ...buttons);
};

const buildQuickPickItem = (
  command: CommandT
): CommandT & vscode.QuickPickItem => {
  return {
    ...command,
    label: command.title,
  };
};

const patchForQuickPick = (commands: CommandsT) => {
  return commands.map(buildQuickPickItem);
};

const patchForInformationMessageButton = (
  commandTitles: Array<CommandTitlesEnum>
): Array<vscode.MessageItem> => {
  return commandTitles.map((commandTitle) => {
    return {
      title: commandTitle,
    };
  });
};

export {
  registerCommand,
  executeCommand,
  showQuickPick,
  showInputBox,
  showInformationMessage,
  buildQuickPickItem,
  patchForQuickPick,
  patchForInformationMessageButton,
};
