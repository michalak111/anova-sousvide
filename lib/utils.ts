export const noop = () => {
  // silence is a gold
};

export const sleep = (timeout = 500) => new Promise((res) => setTimeout(res, timeout));
