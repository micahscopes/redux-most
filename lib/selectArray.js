'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectArray = undefined;

var _core = require('@most/core');

var _prelude = require('@most/prelude');

var selectArray = exports.selectArray = (0, _prelude.curry2)(function (actionTypes, stream) {
  return (0, _core.filter)(function (_ref) {
    var type = _ref.type;
    return type && (0, _prelude.findIndex)(type, actionTypes) !== -1;
  }, stream);
});