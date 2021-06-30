var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { skipRepeats, MulticastSource, never, runEffects } from '@most/core';
import { newDefaultScheduler } from '@most/scheduler';
import { STATE_STREAM_SYMBOL } from './constants';

var getState$ = function getState$(store) {
  var scheduler = newDefaultScheduler();
  var state$ = new MulticastSource(never());
  runEffects(state$, scheduler);
  store.subscribe(function () {
    return state$.event(scheduler.currentTime(), store.getState());
  });
  return state$;
};

export var createStateStreamEnhancer = function createStateStreamEnhancer(epicMiddleware) {
  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;

      var middlewareApi = _defineProperty({
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      }, STATE_STREAM_SYMBOL, skipRepeats(getState$(store)));

      _dispatch = epicMiddleware(middlewareApi)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
};