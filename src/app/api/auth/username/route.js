import { NextResponse } from "next/server";
import { getUsernameFromCookies } from "../../../utils/getUsernameFromCookies";
import dbConnect from "../../../utils/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    const username = await getUsernameFromCookies();

    if (!username) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error("Username fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
