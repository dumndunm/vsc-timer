import { TimeUnits, DEFAULT_TIME_UNITS } from '../modules/timer';

const getTimeQuantity = (input: string): number => {
  return Number(input.slice(0, -1));
};

const isTimeUnits = (timeUnits: string): timeUnits is TimeUnits => {
  return Object.values<string>(TimeUnits).includes(timeUnits);
};

const getTimeUnits = (input: string): TimeUnits | null => {
  const timeUnits = input.slice(-1);
  return isTimeUnits(timeUnits) ? timeUnits : null;
};

const parseInput = (input: string): [number, TimeUnits] => {
  return [getTimeQuantity(input), getTimeUnits(input) ?? DEFAULT_TIME_UNITS];
};

export { parseInput };
