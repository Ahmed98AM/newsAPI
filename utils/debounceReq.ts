const debounceReq = (callback: any, time: any) => {
  let interval: any;
  return (...args: any) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time);
  };
};

export default debounceReq;
