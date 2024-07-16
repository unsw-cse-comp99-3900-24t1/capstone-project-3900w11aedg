import path from 'path';
import fs from 'fs';

export const getProjectRoot = (currentDir: string) => {
  while (fs.existsSync(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.join(currentDir, '..');
  }
  return currentDir;
};
