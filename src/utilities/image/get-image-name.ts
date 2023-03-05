import crypto from 'crypto';

export function nameGenerator(name: string, ex: string) {
  if (name === undefined) {
    return undefined;
  }
  return `${crypto.randomUUID()}.${ex}`;
}
