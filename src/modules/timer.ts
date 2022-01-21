import { setTimeout, setInterval } from 'timers';

const ONE_SECOND = 1000;

enum TimeUnits {
  seconds = 's',
  minutes = 'm',
  hours = 'h',
}
const DEFAULT_TIME_UNITS = TimeUnits.seconds;

enum TimerStateEnum {
  onInitial = 'onInitial',
  onRun = 'onRun',
  onPause = 'onPause',
  onEnd = 'onEnd',
}

const humanReadableTimeUnits = {
  [TimeUnits.seconds]: 'seconds',
  [TimeUnits.minutes]: 'minutes',
  [TimeUnits.hours]: 'hours',
};

const multipliersByTimeUnits = {
  [TimeUnits.seconds]: ONE_SECOND,
  [TimeUnits.minutes]: ONE_SECOND * 60,
  [TimeUnits.hours]: ONE_SECOND * 60 * 60,
};

class Timer {
  private timeoutInstance: NodeJS.Timeout | null;
  private intervalInstance: NodeJS.Timeout | null;

  private state: TimerStateEnum;

  private timeMs: number | null;
  private passedTime: number;

  humanReadableTime: string;

  constructor() {
    this.timeoutInstance = null;
    this.intervalInstance = null;

    this.state = TimerStateEnum.onInitial;

    this.timeMs = 0;
    this.passedTime = 0;

    this.humanReadableTime = '';
  }

  private isTimeoutExist(
    timeoutInstance: NodeJS.Timeout | null
  ): timeoutInstance is NodeJS.Timeout {
    return timeoutInstance !== null && true;
  }

  private isIntervalExist(
    intervalInstance: NodeJS.Timeout | null
  ): intervalInstance is NodeJS.Timeout {
    return intervalInstance !== null && true;
  }

  private isTimeMsExist(timeMs: number | null): timeMs is number {
    return timeMs !== null && true;
  }

  private calculateTimeMs(timeQuantity: number, timeUnits: TimeUnits) {
    return timeQuantity * multipliersByTimeUnits[timeUnits];
  }

  private onIntervalTick = () => {
    this.passedTime += ONE_SECOND;
  };

  private getHumanReadableTime(timeQuantity: number, timeUnits: TimeUnits) {
    return `${timeQuantity} ${
      timeQuantity > 1
        ? humanReadableTimeUnits[timeUnits]
        : humanReadableTimeUnits[timeUnits].slice(0, -1)
    }`;
  }

  private destroyTimers() {
    if (
      !this.isTimeoutExist(this.timeoutInstance) ||
      !this.isIntervalExist(this.intervalInstance)
    ) {
      return;
    }

    this.timeoutInstance = null;
    this.intervalInstance = null;
  }

  private startTimers(onTimerEnd: () => void) {
    if (!this.isTimeMsExist(this.timeMs)) {
      return;
    }

    this.destroyTimers();
    this.timeoutInstance = setTimeout(onTimerEnd, this.timeMs);
    this.intervalInstance = setInterval(this.onIntervalTick, ONE_SECOND);
  }

  private stopTimers() {
    if (
      !this.isTimeoutExist(this.timeoutInstance) ||
      !this.isIntervalExist(this.intervalInstance)
    ) {
      return;
    }

    clearTimeout(this.timeoutInstance);
    clearInterval(this.intervalInstance);
  }

  private refreshTimers() {
    if (
      !this.isTimeoutExist(this.timeoutInstance) ||
      !this.isIntervalExist(this.intervalInstance)
    ) {
      return;
    }

    this.timeoutInstance.refresh();
    this.intervalInstance.refresh();
  }

  setState(state: TimerStateEnum) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  setTime([timeQuantity, timeUnits]: [number, TimeUnits]) {
    this.timeMs = this.calculateTimeMs(timeQuantity, timeUnits);
    this.humanReadableTime = this.getHumanReadableTime(timeQuantity, timeUnits);
  }

  start(onTimerEnd: () => void) {
    this.startTimers(onTimerEnd);
    this.setState(TimerStateEnum.onRun);
  }

  stop() {
    this.destroy();
    this.setState(TimerStateEnum.onInitial);
  }

  pause() {
    this.stopTimers();
    this.setState(TimerStateEnum.onPause);
  }

  restart() {
    this.refreshTimers();
    this.setState(TimerStateEnum.onRun);
  }

  resume(onTimerEnd: () => void) {
    if (!this.isTimeMsExist(this.timeMs)) {
      return;
    }

    this.timeMs = this.timeMs - this.passedTime;
    this.startTimers(onTimerEnd);
    this.setState(TimerStateEnum.onRun);
  }

  destroy() {
    this.stopTimers();
    this.destroyTimers();

    this.timeMs = 0;
    this.passedTime = 0;

    this.humanReadableTime = '';

    this.setState(TimerStateEnum.onInitial);
  }
}

export { TimeUnits, DEFAULT_TIME_UNITS, TimerStateEnum, Timer };
