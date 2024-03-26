import { NextResponse } from "next/server";
import isValidURL from "@/app/lib/isValidURL";
import { getLinks } from "@/app/lib/db";
import { addLink } from "@/app/lib/db";

export async function GET(request) {
  const links = await getLinks(100, 0);
  return NextResponse.json(links, { status: 200 });
}

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

  const dbResponse = await addLink(url);
  return NextResponse.json(dbResponse, { status: 201 });
}
