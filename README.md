# strict-require

Prevents accidentally `require`-ing modules that are not in package.json

## The problem

Since `npm@3` all modules have been installed in `./node_modules` by default in a flat hierarchy. This makes it easy to accidentally `require` modules in your code which are not listed as dependencies when they are installed as dependencies of other modules in your dependency tree.

This can make your code fragile when shipping into environments which may install modules differently, or if unrelated changes to your dependency tree cause a module to no longer be available.

The solution

In order to avoid this, `strict-require` wraps `require` calls in a check in the local package.json file to ensure a module has been explicitly depended on before allowing it to be `require`-ed.

## Usage

Add the following line to the top of your project's index file, above any other requires:

```javascript
require('strict-require').strict();
```

This will then cause any implicit dependencies to throw an error.

Alternatively, if you simply wish to output a console message when an implicit dependency is found:

```javascript
require('strict-require').warn();
```

## Important note

This module adds some synchronous and blocking overhead to require calls, so possibly shouldn't be used in production. However, since `require` is already blocking it's generally good practice to avoid `require`-ing files after inital app start-up anyway.
