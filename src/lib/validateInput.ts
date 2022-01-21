const VALIDATE_REGEXP = /^\d*(s|m|h)$/;
const INVALID_INPUT_MESSAGE =
  'Please enter a valid value, for example "30s" or "10m" or "1h"';

const trimSpaces = (input: string): string => {
  return input.replaceAll(' ', '');
};

const isValidInput = (input: string): boolean => {
  return VALIDATE_REGEXP.test(input);
};

const validateInput = (input: string): string | null => {
  return isValidInput(trimSpaces(input)) ? null : INVALID_INPUT_MESSAGE;
};

export { validateInput };
