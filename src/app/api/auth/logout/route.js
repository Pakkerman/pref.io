import { endSessionForUser } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  await endSessionForUser();
  return NextResponse.json({}, { status: 200 });
}
