import { NextResponse } from "next/server";
import isValidURL from "@/app/lib/isValidURL";

const disallowedList = [
  "pref.io",
  "pref-puce.vercel.app",
  process.env.NEXT_PUBLIC_VERCEL_URL,
];

export async function POST(request) {
  const contentType = await request.headers.get("content-type");
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "invalid request" }, { status: 415 });
  }
  const data = await request.json();
  const url = data && data.url ? data.url : null;
  const valid = await isValidURL(url, disallowedList);
  if (!valid) {
    return NextResponse.json(
      { message: `${url} is not allowed` },
      { ststus: 400 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
