#!/usr/bin/env node

const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const path = require('path');
const fs = require('fs');

console.clear();

console.log(
  chalk.cyan(
    figlet.textSync('Pharos By Kazuha', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })
  )
);

const spinner = ora({
  text: chalk.yellow('Initializing core modules...'),
  spinner: 'earth',
}).start();

setTimeout(() => {
  spinner.text = chalk.magenta('Injecting virtual stack...');
}, 1000);

setTimeout(() => {
  spinner.text = chalk.blue('Spawning async task threads...');
}, 2000);

setTimeout(() => {
  spinner.text = chalk.green('Linking quantum matrix...');
}, 3000);

setTimeout(() => {
  spinner.text = chalk.red('Finalizing startup sequence...');
}, 4000);

setTimeout(() => {
  spinner.succeed(chalk.bold.green('System Ready'));
  console.log(chalk.bgBlackBright('\n> Executing core Follow Me One Guthub Kazuha787 ...\n'));

  // Start the Main Bot setup:
  require('./src/index');
}, 5000);
