import { Card } from '../config/types.ts';

const sortFunction = (data: Card[], key: keyof Card, isAscending = true): Card[] => {
  return [...data].sort((a, b) => {
    if (key !== ('pinned' as keyof Card)) {
      if (!a.pinned && b.pinned) {
        return 1;
      }
      if (a.pinned && !b.pinned) {
        return -1;
      }
    }
    if (!a[key] && !b[key]) {
      return 0;
    }
    if (a[key] && !b[key]) {
      return -1;
    }
    if (!a[key] && b[key]) {
      return 1;
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
