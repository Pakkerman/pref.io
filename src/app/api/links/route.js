import { addLink, getLinks, getMinLinksVisits } from "@/app/lib/db";
import isValidURL from "@/app/lib/isValidURL";
import { setSessionUser } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function GET(request) {
  const links = await getMinLinksVisits(100, 0);
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
  const responseData = dbResponse && dbResponse.data ? dbResponse.data : {};
  const responseStatus =
    dbResponse && dbResponse.status ? dbResponse.status : 500;

  return NextResponse.json(responseData, { status: responseStatus });
}
