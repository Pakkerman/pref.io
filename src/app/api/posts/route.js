import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ hello: "there" });
}

export async function POST() {
  return NextResponse.json({ hello: "POST" });
}
