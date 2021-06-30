'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withState = undefined;

var _core = require('@most/core');

var toArray = function toArray(state, action) {
  return [state, action];
};

var withState = exports.withState = (0, _core.snapshot)(toArray);