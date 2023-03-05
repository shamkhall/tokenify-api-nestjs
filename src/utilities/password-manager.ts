import { hash, verify } from 'argon2';


export async function validator(hash: string, plain: string): Promise<boolean> {
  return await verify(hash, plain);
}

export async function plainToHash(plain): Promise<string> {
  return await hash(plain);
}
