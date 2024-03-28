import { pbkdf2Sync } from "node:crypto";

const saltKey = process.env.SALT_KEY ? process.env.SALT_KEY : "salt";
const hashInterations = 10000;

export function hashPassowrd(rawPasswordString) {
  const key = pbkdf2Sync(
    rawPasswordString,
    saltKey,
    hashInterations,
    64,
    "sha512",
  );
  return key.toString("hex");
}

export function isMatchingPassword(enteredPassword, storedHash) {
  const hash = pbkdf2Sync(
    enteredPassword,
    saltKey,
    hashInterations,
    64,
    "sha512",
  ).toString("hex");
  return storedHash === hash;
}

function veryifyPasswordWorking() {
  const pw = "123";
  const hash = hashPassowrd(pw);
  const right = isMatchingPassword("123", hash);
  const wrong = isMatchingPassword(`333`, hash);

  console.log(`pw: ${pw}`);
  console.log(`hash: ${hash}`);
  console.log(`right: ${right}`);
  console.log(`wrong: ${wrong}`);
}

veryifyPasswordWorking();
