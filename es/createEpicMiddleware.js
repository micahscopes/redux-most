import { map, switchLatest, runEffects, MulticastSource, never, tap, now } from '@most/core';
import { newDefaultScheduler } from '@most/scheduler';
import { epicEnd } from './actions';
import { STATE_STREAM_SYMBOL } from './constants';

export var createEpicMiddleware = function createEpicMiddleware(epic) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware.');
  }

  var scheduler = newDefaultScheduler();

  var actionsIn$ = new MulticastSource(never());

  var epic$ = new MulticastSource(now(epic));

  var middlewareApi = void 0;

  var epicMiddleware = function epicMiddleware(_middlewareApi) {
    middlewareApi = _middlewareApi;

    return function (next) {
      var callNextEpic = function callNextEpic(nextEpic) {
        var state$ = middlewareApi[STATE_STREAM_SYMBOL];
        var isUsingStateStreamEnhancer = !!state$;

        return isUsingStateStreamEnhancer ? nextEpic(actionsIn$, state$) : nextEpic(actionsIn$, middlewareApi);
      };

      var actionsOut$ = switchLatest(map(callNextEpic, epic$));

      runEffects(tap(middlewareApi.dispatch, actionsOut$), scheduler);

      return function (action) {
        var result = next(action);
        actionsIn$.event(scheduler.currentTime(), action);
        return result;
      };
    };
  };

  epicMiddleware.replaceEpic = function (nextEpic) {
    middlewareApi.dispatch(epicEnd());
    epic$.event(scheduler.currentTime(), nextEpic);
  };
  return epicMiddleware;
};