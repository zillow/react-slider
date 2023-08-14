/**
 * To prevent text selection while dragging.
 * http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
 */
export const pauseEvent = (e) => {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  return false;
};

export const stopPropagation = (e) => {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
};

export const sanitizeInValue = (x) => {
  if (x == null) {
    return [];
  }
  return Array.isArray(x) ? x.slice() : [x];
};

export const prepareOutValue = (x) => {
  return x !== null && x.length === 1 ? x[0] : x.slice();
};

export const trimSucceeding = (length, nextValue, minDistance, max) => {
  for (let i = 0; i < length; i += 1) {
    const padding = max - i * minDistance;
    if (nextValue[length - 1 - i] > padding) {
      nextValue[length - 1 - i] = padding;
    }
  }
};

export const trimPreceding = (length, nextValue, minDistance, min) => {
  for (let i = 0; i < length; i += 1) {
    const padding = min + i * minDistance;
    if (nextValue[i] < padding) {
      nextValue[i] = padding;
    }
  }
};

export const addHandlers = (eventMap) => {
  Object.keys(eventMap).forEach((key) => {
    if (typeof document !== 'undefined') {
      document.addEventListener(key, eventMap[key], false);
    }
  });
};

export const removeHandlers = (eventMap) => {
  Object.keys(eventMap).forEach((key) => {
    if (typeof document !== 'undefined') {
      document.removeEventListener(key, eventMap[key], false);
    }
  });
};

export const trimAlignValue = (val, props) => {
  return alignValue(trimValue(val, props), props);
};

export const alignValue = (val, props) => {
  const valModStep = (val - props.min) % props.step;
  let alignedValue = val - valModStep;

  if (Math.abs(valModStep) * 2 >= props.step) {
    alignedValue += valModStep > 0 ? props.step : -props.step;
  }

  return parseFloat(alignedValue.toFixed(5));
};

export const trimValue = (val, props) => {
  let trimmed = val;
  if (trimmed <= props.min) {
    trimmed = props.min;
  }
  if (trimmed >= props.max) {
    trimmed = props.max;
  }

  return trimmed;
};
