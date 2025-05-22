import jwt from "jsonwebtoken";
import User from "../models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function verifyAdmin() {
  try {
    // Get token from cookies
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return {
        isValid: false,
        response: NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 }
        )
      };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.position !== '9h;08NGKbR?0') {
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