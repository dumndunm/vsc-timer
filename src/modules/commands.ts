import * as vscode from 'vscode';
import { TimerStateEnum, Timer } from './timer';

import {
  executeCommand,
  showQuickPick,
  showInputBox,
  patchForQuickPick,
  showInformationMessage,
  patchForInformationMessageButton,
} from '../lib/vscode';
import { validateInput } from '../lib/validateInput';
import { parseInput } from '../lib/parseInput';
import { getCommandsAccordingState, isCommandTitle, onCommandChoice } from '../lib/commands';

const INPUT_BOX_PLACEHOLDER =
  'Enter the time value, e.g.: "5s" - 5 seconds, "2m" - 2 minutes, "1h" - 1 hour';

const ALWAYS_ACCESSIBLE = 'always';
const NEVER_ACCESSIBLE = 'never';

enum CommandsEnum {
  callTimer = 'timer.callTimer',
  setTime = 'timer.setTime',
  start = 'timer.start',
  stop = 'timer.stop',
  pause = 'timer.pause',
  restart = 'timer.restart',
  resume = 'timer.resume',
  destroy = 'timer.destroy',
}

enum CommandTitlesEnum {
  callTimer = 'Timer',
  setTime = 'Timer: Set time and start',
  start = 'Command for internal use',
  stop = 'Timer: Stop',
  pause = 'Timer: Pause',
  restart = 'Timer: Restart',
  resume = 'Timer: Resume',
  destroy = 'Command for internal use',
}

export type CommandT = {
  command: CommandsEnum;
  title: CommandTitlesEnum;
  callback: () => void;
  whenAccessed:
    | Array<TimerStateEnum>
    | typeof ALWAYS_ACCESSIBLE
    | typeof NEVER_ACCESSIBLE;
};

export type CommandsT = Array<CommandT>;

const timer = new Timer();

const callTimerCommandAction = () => {
  const timerState = timer.getState();

  if (timerState === TimerStateEnum.onInitial) {
    executeCommand(CommandsEnum.setTime);
  } else {
    const currentStateCommands = getCommandsAccordingState(
      commands,
      timerState
    );

    showQuickPick(patchForQuickPick(currentStateCommands)).then(
      onCommandChoice
    );
  }
};
const setTimeCommandAction = () => {
  showInputBox(INPUT_BOX_PLACEHOLDER, validateInput).then(onEnterTime);
};
const startCommandAction = () => {
  timer.start(onTimerEnd);
};
const stopCommandAction = () => {
  timer.stop();
};
const pauseCommandAction = () => {
  timer.pause();
};
const restartCommandAction = () => {
  timer.restart();
};
const resumeCommandAction = () => {
  timer.resume(onTimerEnd);
};
const destroyCommandAction = () => {
  timer.destroy();
};

const commands: CommandsT = [
  {
    command: CommandsEnum.callTimer,
    title: CommandTitlesEnum.callTimer,
    callback: callTimerCommandAction,
    whenAccessed: [TimerStateEnum.onInitial],
  },
  {
    command: CommandsEnum.setTime,
    title: CommandTitlesEnum.setTime,
    callback: setTimeCommandAction,
    whenAccessed: [TimerStateEnum.onInitial],
  },
  {
    command: CommandsEnum.start,
    title: CommandTitlesEnum.start,
    callback: startCommandAction,
    whenAccessed: NEVER_ACCESSIBLE,
  },
  {
    command: CommandsEnum.stop,
    title: CommandTitlesEnum.stop,
    callback: stopCommandAction,
    whenAccessed: [TimerStateEnum.onRun, TimerStateEnum.onPause],
  },
  {
    command: CommandsEnum.pause,
    title: CommandTitlesEnum.pause,
    callback: pauseCommandAction,
    whenAccessed: [TimerStateEnum.onRun],
  },
  {
    command: CommandsEnum.restart,
    title: CommandTitlesEnum.restart,
    callback: restartCommandAction,
    whenAccessed: [TimerStateEnum.onRun, TimerStateEnum.onEnd],
  },
  {
    command: CommandsEnum.resume,
    title: CommandTitlesEnum.resume,
    callback: resumeCommandAction,
    whenAccessed: [TimerStateEnum.onPause],
  },
  {
    command: CommandsEnum.destroy,
    title: CommandTitlesEnum.destroy,
    callback: destroyCommandAction,
    whenAccessed: NEVER_ACCESSIBLE,
  },
];
const getCommandsByTitle = (
  commands: CommandsT
): Record<CommandTitlesEnum, CommandsEnum> => {
  return Object.fromEntries([
    ...commands.map(({ title, command }) => [title, command]),
  ]);
};
const commandsByTitle = getCommandsByTitle(commands);

const onPressCommandButton = (
  command: vscode.MessageItem | undefined
) => {
  if (command === undefined) {
    executeCommand(CommandsEnum.destroy);
    return;
  }

  if (!isCommandTitle(command.title)) {
    return;
  }

  executeCommand(commandsByTitle[command.title]);
};

const onTimerEnd = () => {
  timer.setState(TimerStateEnum.onInitial);

  showInformationMessage(
    `Timer for ${timer.humanReadableTime} is over`,
    ...patchForInformationMessageButton([CommandTitlesEnum.restart])
  ).then(onPressCommandButton);
};

const onEnterTime = (input: string | undefined) => {
  if (input === undefined) {
    return;
  }

  timer.setTime(parseInput(input));
  executeCommand(CommandsEnum.start);
};

export {
  CommandsEnum,
  CommandTitlesEnum,
  ALWAYS_ACCESSIBLE,
  NEVER_ACCESSIBLE,
  commands,
};
