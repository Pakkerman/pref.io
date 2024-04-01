import * as jose from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JOSE_SESSION_KEY);
const issuer = "urn:example:issuer";
const audience = "urn:example:audience";
const expiresAt = "10s";

export async function encodeUserSession(userId) {
  const jwt = await new jose.EncryptJWT({ user: userId })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiresAt)
    .encrypt(secret);

  return jwt;
}

export async function decodeUserSession(jwt) {
  try {
    const { payload } = await jose.jwtDecrypt(jwt, secret, {
      issuer,
      audience,
    });
    const { user } = payload;
    return user;
  } catch (err) {
    console.log(err);
  }
  return null;
}

export async function setSessionUser(userId) {
  const newSessionValue = await encodeUserSession(userId);
  cookies().set("session_id", newSessionValue);
}

export async function getSessionUser() {
  const cookieSessionValue = cookies().get("session_id");
  if (!cookieSessionValue) {
    return null;
  }

  const extractedUserId = await decodeUserSession(cookieSessionValue.value);
  if (!extractedUserId) {
    return null;
  }

  return extractedUserId;
}

export async function endSessionForUser() {
  cookies().delete("session_id");
}
