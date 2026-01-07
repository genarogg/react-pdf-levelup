import colors from "colors";

const success = (...args: any[]) => {
  return console.log(colors.green(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const warning = (...args: any[]) => {
  return console.log(colors.yellow(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const error = (...args: any[]) => {
  return console.log(colors.red(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const info = (...args: any[]) => {
  return console.log(colors.cyan(JSON.stringify(args.length === 1 ? args[0] : args, null, 2)));
};

const log = {
  success,
  warning,
  error,
  info,
};

export default log;