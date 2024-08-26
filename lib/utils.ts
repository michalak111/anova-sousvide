export const noop = () => {
  // silence is a gold
};

export const sleep = (timeout = 750) => new Promise<void>((res) => setTimeout(res, timeout));
