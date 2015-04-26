#!/usr/bin/env node
var cli = require('cli').enable('version', 'status');
var fs = require('fs');
var path = require('path');
var depInfo = require('../');

cli.setApp('npm-dep-info', '1.3.1');

cli.parse({
  markdown: ['M', 'Output as Markdown'],
  table: ['T', 'Output as table'],
  include: [
    'I',
    'Include extra properties from package.json of the dependency' +
    ' (--include author,license)',
    'string'
  ],
  output: ['o', 'Write output to file', 'path'],
  input: ['i', 'Location of package.json (default ./)', 'path']
});

function readPkg(dirPath){
  var pjPath = path.join(dirPath || './', 'package.json');
  try {
    var pj = fs.readFileSync(pjPath, { encoding: 'utf8' });
  } catch (e) {
    cli.fatal('Cannot read package.json');
    return -1;
  }

  try {
    return JSON.parse(pj);
  } catch (e) {
    cli.fatal('Cannot parse package.json');
    return -1;
  }
}

cli.main(function (args, options) {
  var pkg = readPkg(options.input);

  if (pkg === -1) {
    return;
  }

  var includes = options.include ? options.include.split(',') : null;
  var result;
  try {
    if (options.markdown) {
      result = depInfo.markdownOutput(pkg, options.input, includes);
    } else if (options.table) {
      result = depInfo.tableOutput(pkg, options.input, includes);
    } else {
      var depObj = depInfo.defaultOutput(pkg, options.input, includes);
      result = JSON.stringify(depObj, null, 2);
    }
  } catch (e) {
    cli.fatal(e.message);
  }

  if (options.output) {
    try {
      fs.writeFileSync(options.output, result);
    } catch (e) {
      cli.fatal('Cannot write file to ' + options.output);
    }
    return;
  }

  cli.output(result);
});
