'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEpicMiddleware = undefined;

var _core = require('@most/core');

var _scheduler = require('@most/scheduler');

var _actions = require('./actions');

var _constants = require('./constants');

var createEpicMiddleware = exports.createEpicMiddleware = function createEpicMiddleware(epic) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware.');
  }

  var scheduler = (0, _scheduler.newDefaultScheduler)();

  var actionsIn$ = new _core.MulticastSource((0, _core.never)());

  var epic$ = new _core.MulticastSource((0, _core.now)(epic));

  var middlewareApi = void 0;

  var epicMiddleware = function epicMiddleware(_middlewareApi) {
    middlewareApi = _middlewareApi;

    return function (next) {
      var callNextEpic = function callNextEpic(nextEpic) {
        var state$ = middlewareApi[_constants.STATE_STREAM_SYMBOL];
        var isUsingStateStreamEnhancer = !!state$;

        return isUsingStateStreamEnhancer ? nextEpic(actionsIn$, state$) : nextEpic(actionsIn$, middlewareApi);
      };

      var actionsOut$ = (0, _core.switchLatest)((0, _core.map)(callNextEpic, epic$));

      (0, _core.runEffects)((0, _core.tap)(middlewareApi.dispatch, actionsOut$), scheduler);

      return function (action) {
        var result = next(action);
        actionsIn$.event(scheduler.currentTime(), action);
        return result;
      };
    };
  };

  epicMiddleware.replaceEpic = function (nextEpic) {
    middlewareApi.dispatch((0, _actions.epicEnd)());
    epic$.event(scheduler.currentTime(), nextEpic);
  };
  return epicMiddleware;
};