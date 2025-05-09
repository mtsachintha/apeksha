import { NextResponse } from "next/server";
import { getUserFromCookies } from "../../../utils/getUserFromCookies";
import dbConnect from "../../../utils/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
