var fs = require('fs');
var path = require('path');
var url = require('url');

var pj = fs.readFileSync('package.json', { encoding: 'utf8' });
var pkg = JSON.parse(pj);

function eachValue(obj, iterator) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    iterator(obj[keys[i]]);
  }
}

function generateMeta(moduleNames, relPath, moduleSeletor) {
  return moduleNames.reduce(function (seed, moduleName) {
    var modulePjPath = path.join(
      relPath || './',
      'node_modules',
      moduleName,
      'package.json');
    var modulePj;
    try {
      modulePj = fs.readFileSync(modulePjPath, { encoding: 'utf8' });
    } catch (e) {
      // throw new Error('File not found for "' + modulePjPath + '".' +
      //   ' Make sure you have run npm install.');
      modulePj = '{"name":"' + moduleName + '"}';
    }
    if (moduleSeletor) {
      seed[moduleName] = moduleSeletor(JSON.parse(modulePj));
    } else {
      seed[moduleName] = JSON.parse(modulePj);
    }
    return seed;
  }, {});
}

function defaultOutput(pkg, relPath, includes) {
  function moduleSeletor(m) {
    return m.description || '';
  }
  function includesSeletor(m) {
    var modulePkg = { description: m.description };
    includes.forEach(function (propName) {
      modulePkg[propName] = m[propName];
    });
    return modulePkg;
  }

  var result = {};
  if (typeof pkg.dependencies === 'object') {
    result.dependencies = generateMeta(
      Object.keys(pkg.dependencies),
      relPath,
      includes ? includesSeletor : moduleSeletor);
  }
  if (typeof pkg.devDependencies === 'object') {
    result.devDependencies = generateMeta(
      Object.keys(pkg.devDependencies),
      relPath,
      includes ? includesSeletor : moduleSeletor);
  }

  return result;
}

function markdownOutput(pkg, relPath, includes) {
  var result = '# ' + pkg.name + '\n\n';

  function depWriter(dep) {
    result += '### ' + dep.name + '\n\n';
    if (dep.description) {
      result += dep.description + '\n\n';
    }
    if (dep.homepage) {
      result += dep.homepage + '\n\n';
    }
    if (includes) {
      includes.forEach(function (propName) {
        var prop = dep[propName];
        if (!prop) {
          return;
        }
        if (typeof prop === 'string') {
          result += '#### ' + propName + '\n\n';
          result += prop + '\n\n';
        } else {
          result += '#### ' + propName + '\n\n';
          result += '```\n' + JSON.stringify(prop, null, 2) + '\n```\n\n';
        }
      });
    }
  }

  if (typeof pkg.dependencies === 'object') {
    var dependencies = generateMeta(
      Object.keys(pkg.dependencies),
      relPath);
    result += "## dependencies\n\n";
    eachValue(dependencies, depWriter);
  }
  if (typeof pkg.devDependencies === 'object') {
    var devDependencies = generateMeta(
      Object.keys(pkg.devDependencies),
      relPath);
    result += "## devDependencies\n\n";
    eachValue(devDependencies, depWriter);
  }

  if (result === "") {
    return "No dependencies";
  } else {
    // trim linebreaks
    return result.substr(0, result.length - 2);
  }
}

module.exports = {
  defaultOutput: defaultOutput,
  markdownOutput: markdownOutput
}
