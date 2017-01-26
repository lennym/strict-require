const Module = require('module');
const findup = require('findup');
const path = require('path');

const builtin = require('builtin-modules').reduce((map, name) => {
  map[name] = true;
  return map;
}, {});

const _require = Module.prototype.require;

const cache = {};

function patch (callback) {
  Module.prototype.require = function (p) {
    if (!p.match(/^\.|\//)) {
      const dir = path.dirname(this.filename);
      const pkg = cache[dir] || findup.sync(dir, 'package.json');
      cache[dir] = pkg;
      const dependencies = require(path.join(pkg, 'package.json')).dependencies;
      if (!dependencies[p] && !builtin[p]) {
        callback(p, path.join(pkg, 'package.json'));
      }
    }
    return _require.call(this, p);
  };
}

module.exports = {
  strict: () => {
    patch((name, pkg) => {
      throw new Error(`Attempted to load module ${name}, which is not defined as a dependency in ${pkg}`);
    });
  },
  warn: () => {
    patch((name, pkg) => {
      console.warn(`Attempted to load module ${name}, which is not defined as a dependency in ${pkg}`);
    });
  }
};
