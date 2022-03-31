export const isNumber = (str: string) => {
  return !Number.isNaN(parseFloat(String(str))) && Number.isFinite(Number(str));
};
