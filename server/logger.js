import chalk from 'chalk';

const format = (lvl, colorFn, msg) => {
  return `${chalk.blue(new Date().toISOString())} ${colorFn('[' + lvl + ']')} ${msg}`;
};

export default {
  success: (msg) => console.log(format('SUCCESS', chalk.green, msg)),
  notice: (msg) => console.log(format('NOTICE', chalk.hex('#FFA500'), msg)),
  log: (msg) => console.log(format('LOG', chalk.white, msg)),
  warn: (msg) => console.log(format('WARN', chalk.yellow, msg)),
  error: (msg) => console.log(format('ERROR', chalk.red, msg)),
  fail: (msg) => console.log(format('FAIL', chalk.red, msg)),
}
