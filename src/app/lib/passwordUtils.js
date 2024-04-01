import pbkdf2 from "./pbkdf2";

export const runtime = "edge";

const saltKey = process.env.SALT_KEY ? process.env.SALT_KEY : "salt";
const hashInterations = 10000;

export async function hashPassowrd(rawPasswordString) {
  const key = await pbkdf2(
    rawPasswordString,
    saltKey,
    hashInterations,
    64,
    "sha512",
  );
  return key;
}

export async function isMatchingPassword(enteredPassword, storedHash) {
  const hash = await pbkdf2(
    enteredPassword,
    saltKey,
    hashInterations,
    64,
    "sha512",
  );
  return storedHash === hash;
}
