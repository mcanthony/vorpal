'use strict';

var Vorpal = require('./../../lib/vorpal');

var vorpal = new Vorpal();
var less = require('vorpal-less');
var repl = require('vorpal-repl');
vorpal.use(less).use(repl);

vorpal.command('add [numbers...]', 'Adds numbers together')
  .alias('addition')
  .alias('plus')
  .action(function (args, cb) {
    var numbers = args.numbers;
    var sum = 0;
    for (var i = 0; i < numbers.length; ++i) {
      sum += parseFloat(numbers[i]);
    }
    this.log(sum);
    cb(undefined, sum);
  });

vorpal.command('double [values...]', 'Doubles a value on each tab press')
  .autocompletion(function (text, iteration, cb) {
    if (iteration > 1000000) {
      cb(undefined, ['cows', 'hogs', 'horses']);
    } else {
      var number = String(text).trim();
      if (!isNaN(number)) {
        number = (number < 1) ? 1 : number;
        cb(undefined, 'double ' + number * 2);
      } else {
        cb(undefined, 'double 2');
      }
    }
  })
  .action(function (args, cb) {
    cb();
  });

vorpal.catch('[commands...]')
  .option('-d, --dog')
  .parse(function (str) {
    return str + ' | reverse -c';
  })
  .action(function (args, cb) {
    if (args.commands) {
      console.log(args);
      this.log(args.commands.join(' '));
    }
    cb();
  });

vorpal.command('reverse')
  .option('-c, --cow')
  .action(function (args, cb) {
    this.log(String(args.stdin || '').split('').reverse().join(''));
    cb();
  });

vorpal.command('promptme')
  .action(function (args, cb) {
    this.prompt({
      type: 'list',
      name: 'data',
      choices: ['a', 'c', 'd'],
      message: 'test'
    }, function (result) {
      console.log(result);
      cb();
    });
  });

vorpal
  .delimiter('calc:')
  .show()
  .parse(process.argv);
