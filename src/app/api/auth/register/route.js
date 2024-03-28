import { registerUser } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const contentType = await request.headers.get("content-type");
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "invalid request" }, { status: 415 });
  }
  const data = await request.json();
  const { username, password, passwordConfirm } = data;
  if (password !== passwordConfirm) {
    return NextResponse.json(
      { message: `Password and confirm must match` },
      { ststus: 400 },
    );
  }
  const isValid = username && password;
  if (!isValid) {
    return NextResponse.json(
      { message: `Username and password are required` },
      { ststus: 400 },
    );
  }

  const toSaveData = { username: data.username, password: data.password };
  if (data.email) {
    toSaveData["email"] = data.email;
  }

  const dbResponse = await registerUser(toSaveData);
  const responseData = dbResponse && dbResponse.data ? dbResponse.data : {};
  const responseStatus =
    dbResponse && dbResponse.status ? dbResponse.status : 500;

  return NextResponse.json(responseData, { status: responseStatus });
}
