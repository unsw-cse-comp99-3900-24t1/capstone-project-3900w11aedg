// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortFunction = <T extends { [key: string]: any }>(
  data: T[],
  key: keyof T,
  isAscending = true
): T[] => {
  return data.sort((a, b) => {
    if (!a[key] || !b[key]) {
      return -1;
    }
    if (a[key] < b[key]) {
      return isAscending ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return isAscending ? 1 : -1;
    }
    return 0;
  });
};

export default sortFunction;
