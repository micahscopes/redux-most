import { snapshot } from '@most/core';

var toArray = function toArray(state, action) {
  return [state, action];
};

export var withState = snapshot(toArray);