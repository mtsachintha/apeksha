import jwt from "jsonwebtoken";
import { getUserFromCookies } from "../utils/getUserFromCookies"; // Import getUserFromCookies
import { NextResponse } from "next/server";

export async function verifyAdmin() {
  try {
    // Get user from cookies
    const user = await getUserFromCookies();

    if (!user) {
      return {
        isValid: false,
        response: NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 }
        )
      };
    }

    // Check if user is an admin
    if (user.position !== "Admin") {
      return {
        isValid: false,
        response: NextResponse.json(
          { success: false, message: "Admin access required" },
          { status: 403 }
        )
      };
    }

    return { isValid: true, user };

  } catch (error) {
    console.error("Admin verification error:", error);
    return {
      isValid: false,
      response: NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      )
    };
  }
}
