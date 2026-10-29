// SHA-512 crypt ("$6$..."), a password hash that nginx's auth_basic_user_file accepts (through
// the server's crypt()). deploy.mjs hashes the kiosk admin password with it locally, so only the
// hash is sent to the server. Algorithm: https://www.akkadia.org/drepper/SHA-crypt.txt
import { createHash, randomBytes } from 'node:crypto';

const ALPHABET = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ROUNDS = 5000; // the default, so the hash needs no "rounds=" field

const sha512 = (...parts) => {
  const hash = createHash('sha512');
  for (const part of parts) hash.update(part);
  return hash.digest();
};

// The first `length` bytes of `digest` repeated end to end
const stretch = (digest, length) =>
  Buffer.concat(Array.from({ length: Math.ceil(length / digest.length) }, () => digest)).subarray(0, length);

const randomSalt = () => Array.from(randomBytes(16), (byte) => ALPHABET[byte & 0x3f]).join('');

export function sha512Crypt(password, salt = randomSalt()) {
  const key = Buffer.from(password, 'utf8');
  const saltBytes = Buffer.from(salt.slice(0, 16), 'utf8');

  const b = sha512(key, saltBytes, key);
  const a = createHash('sha512').update(key).update(saltBytes).update(stretch(b, key.length));
  for (let length = key.length; length > 0; length >>= 1) a.update(length & 1 ? b : key);
  const aDigest = a.digest();

  const p = stretch(sha512(...Array(key.length).fill(key)), key.length);
  const s = stretch(sha512(...Array(16 + aDigest[0]).fill(saltBytes)), saltBytes.length);

  let c = aDigest;
  for (let round = 0; round < ROUNDS; round++) {
    const hash = createHash('sha512');
    hash.update(round & 1 ? p : c);
    if (round % 3) hash.update(s);
    if (round % 7) hash.update(p);
    hash.update(round & 1 ? c : p);
    c = hash.digest();
  }

  // crypt's own base64: little-endian 6-bit groups over a fixed byte shuffle
  let encoded = '';
  const encode = (b2, b1, b0, chars) => {
    let word = (b2 << 16) | (b1 << 8) | b0;
    for (let i = 0; i < chars; i++, word >>= 6) encoded += ALPHABET[word & 0x3f];
  };
  for (let k = 0; k < 21; k++) {
    const [b2, b1, b0] = [[k, k + 21, k + 42], [k + 21, k + 42, k], [k + 42, k, k + 21]][k % 3];
    encode(c[b2], c[b1], c[b0], 4);
  }
  encode(0, 0, c[63], 2);

  return `$6$${saltBytes.toString('utf8')}$${encoded}`;
}
