import { unlink } from 'fs/promises';
import { exists } from './exists';

export async function deleteImage(avatarPath) {
  const isExist = await exists(avatarPath);

  if (isExist) {
    await unlink(avatarPath);
  }
}
