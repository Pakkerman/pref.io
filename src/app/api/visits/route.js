import { saveLinkVisit } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const { linkId } = data;
  const result = await saveLinkVisit(linkId);

  console.log("result visit saved: ", result);
  return NextResponse.json({}, { status: 201 });
}
