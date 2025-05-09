// utils/getUserFromCookies.js
import jwt from "jsonwebtoken";
import User from "../models/User";
import { cookies } from "next/headers";
import dbConnect from "../utils/dbConnect";

export async function getUserFromCookies() {
  try {
    await dbConnect();

    const token = cookies().get("token")?.value;
    if (!token || !process.env.JWT_SECRET) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Exclude password for security
    const user = await User.findById(decoded.userId).select("-password");

    return user || null;
  } catch (err) {
    console.error("getUserFromCookies error:", err);
    return null;
  }
}
