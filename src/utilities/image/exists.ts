import { access } from 'fs/promises';

export async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
