'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineEpics = undefined;

var _core = require('@most/core');

var _prelude = require('@most/prelude');

var combineEpics = exports.combineEpics = function combineEpics(epicsArray) {
  return function (actionsStream, middlewareApiOrStateStream) {
    if (!epicsArray || !Array.isArray(epicsArray)) {
      throw new TypeError('You must provide an array of Epics to combineEpics.');
    }

    if (epicsArray.length < 1) {
      throw new TypeError('The array passed to combineEpics must contain at least one Epic.');
    }

    var callEpic = function callEpic(epic) {
      if (typeof epic !== 'function') {
        throw new TypeError('The array passed to combineEpics must contain only Epics (functions).');
      }

      var out = epic(actionsStream, middlewareApiOrStateStream);

      if (!out || !out.source) {
        var epicIdentifier = epic.name ? 'named ' + epic.name : 'at index ' + (0, _prelude.findIndex)(epic, epicsArray) + ' of the passed in array';

        throw new TypeError('All Epics in the array provided to combineEpics must return a stream. Check the return value of the Epic ' + epicIdentifier + '.');
      }

      return out;
    };

    return (0, _core.mergeArray)((0, _prelude.map)(callEpic, epicsArray));
  };
};