import * as vscode from 'vscode';
import type { CommandsT, CommandT } from 'modules/commands';
import { ALWAYS_ACCESSIBLE, CommandTitlesEnum } from 'modules/commands';
import { TimerStateEnum } from 'modules/timer';
import { executeCommand, registerCommand } from 'lib/vscode';

const getCommandsAccordingState = (
  commands: CommandsT,
  timerState: TimerStateEnum
) => {
  return commands.filter(
    ({ whenAccessed }) =>
      whenAccessed === ALWAYS_ACCESSIBLE || whenAccessed.includes(timerState)
  );
};

const isCommandTitle = (
  commandTitle: string
): commandTitle is CommandTitlesEnum => {
  return Object.values<string>(CommandTitlesEnum).includes(commandTitle)
    ? true
    : false;
};

const registerCommands = (commands: CommandsT): Array<vscode.Disposable> => {
  return commands.map(({ command, callback }) => {
    return registerCommand(command, callback);
  });
};

const onCommandChoice = (command: CommandT | undefined) => {
  if (command === undefined) {
    return;
  }
  executeCommand(command.command);
};

export {
  getCommandsAccordingState,
  isCommandTitle,
  registerCommands,
  onCommandChoice,
};
