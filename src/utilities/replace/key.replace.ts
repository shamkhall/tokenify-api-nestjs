export function publicKeyReplace(text) {
  return text
    ?.replace('-----BEGIN PUBLIC KEY----- ', '-----BEGIN PUBLIC KEY-----\n')
    ?.replace(' -----END PUBLIC KEY-----', '\n-----END PUBLIC KEY-----');
}

export function privateKeyReplace(text) {
  return text
    ?.replace('-----BEGIN PRIVATE KEY----- ', '-----BEGIN PRIVATE KEY-----\n')
    ?.replace(' -----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
}
