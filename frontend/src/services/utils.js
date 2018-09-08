
export const prettifyDate = (date) => {
  // TODO prettify date like '2h ago' or format date & time

  return date.toDateString();
};

export const etherscanLink = address => `https://kovan.etherscan.io/address/${address}`;