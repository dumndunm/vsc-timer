import { TimeUnits, DEFAULT_TIME_UNITS } from '../modules/timer';

const getTimeQuantity = (input: string): number => {
  return Number(input.slice(0, -1));
};

const getTimeUnits = (input: string): TimeUnits | null => {
  const timeUnits = input.slice(-1);
  return timeUnits in TimeUnits ? (timeUnits as TimeUnits) : null;
};

const parseInput = (input: string): [number, TimeUnits] => {
  return [getTimeQuantity(input), getTimeUnits(input) ?? DEFAULT_TIME_UNITS];
};

export { TimeUnits, DEFAULT_TIME_UNITS, parseInput };
