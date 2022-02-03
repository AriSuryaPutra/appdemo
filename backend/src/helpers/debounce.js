const timeouts = [];

const findAndClearTimeout = waChatUuid => {
  if (timeouts.length > 0) {
    const timeoutIndex = timeouts.findIndex(timeout => timeout.uuid === waChatUuid);

    if (timeoutIndex !== -1) {
      clearTimeout(timeouts[timeoutIndex].timeout);
      timeouts.splice(timeoutIndex, 1);
    }
  }
};

const debounce = (func, wait, waChatUuid) => {
  return function executedFunction(...args) {
    const later = () => {
      findAndClearTimeout(waChatUuid);
      func(...args);
    };

    findAndClearTimeout(waChatUuid);

    const newTimeout = {
      uuid: waChatUuid,
      timeout: setTimeout(later, wait)
    };

    timeouts.push(newTimeout);
  };
};

export { debounce };
