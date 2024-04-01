import { getUserByUsername } from "@/app/lib/db";
import { isMatchingPassword } from "@/app/lib/passwordUtils";
import { setSessionUser } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function POST(request) {
  const contentType = await request.headers.get("content-type");
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "invalid request" }, { status: 415 });
  }
  const data = await request.json();
  const { username, password } = data;
  console.log(username, password);

  const isValidData = username && password;
  if (!isValidData) {
    return NextResponse.json({ message: "Wrong" });
  }

  const dbResponse = await getUserByUsername(username);
  const userRecord = dbResponse[0];
  const { id, password: storedUserHash } = userRecord;
  const isValidPasswordRequest = await isMatchingPassword(
    password,
    storedUserHash,
  );
  console.log(isValidPasswordRequest);
  if (!isValidPasswordRequest) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 },
    );
  }

  await setSessionUser(id);
  return NextResponse.json({}, { status: 200 });
}
