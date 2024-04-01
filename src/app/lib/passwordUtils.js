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
  console.log(`\n\n ####### ${key} $$$$$$$$\n\n`);
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

// test
// function veryifyPasswordWorking() {
//   const pw = "123";
//   const hash = hashPassowrd(pw);
//   const right = isMatchingPassword("123", hash);
//   const wrong = isMatchingPassword(`333`, hash);
//
//   console.log(`pw: ${pw}`);
//   console.log(`hash: ${hash}`);
//   console.log(`right: ${right}`);
//   console.log(`wrong: ${wrong}`);
// }
