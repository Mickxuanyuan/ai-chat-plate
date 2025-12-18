const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";

const getCrypto = () => {
  const cryptoObj = (globalThis as unknown as { crypto?: Crypto }).crypto;
  return cryptoObj;
};

export const uuid = () => {
  const cryptoObj = getCrypto();
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  if (!cryptoObj?.getRandomValues) {
    throw new Error("crypto.getRandomValues is not available");
  }

  // Fallback: RFC4122 v4-ish (not strictly validated here).
  const bytes = new Uint8Array(16);
  cryptoObj.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

/**
 * A small `nanoid`-like id generator (URL-safe, 21 chars by default).
 */
export const nanoid = (size = 21) => {
  const cryptoObj = getCrypto();
  if (!cryptoObj?.getRandomValues) {
    throw new Error("crypto.getRandomValues is not available");
  }
  const bytes = new Uint8Array(size);
  cryptoObj.getRandomValues(bytes);

  let id = "";
  for (const byte of bytes) {
    id += ALPHABET[byte & 63];
  }
  return id;
};
