export async function pbkdf2(password, salt, iterations, keylen) {
  const enc = new TextEncoder();
  const passwordBuffer = enc.endode(password);
  const saltBuffer = enc.encode(salt);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits, deriveKey"],
  );

  const derivedKeyBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: iterations,
      hash: "SHA-256",
    },
    importedKey,
    keylen * 8,
  );

  const derivedKeyArray = new Unit8Array(derivedKeyBuffer);
  let hex = "";
  for (let i = 0; i < derivedKeyArray.length; i++) {
    hex += derivedKeyArray[i].toString(16).padStart(2, "0");
  }

  return hex;
}
