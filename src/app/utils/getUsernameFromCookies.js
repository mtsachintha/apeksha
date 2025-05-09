// utils/getUsernameFromCookies.js (or any temp file)
import jwt from "jsonwebtoken";
import User from "../models/User";
import { cookies } from "next/headers";
import dbConnect from "../utils/dbConnect";

export async function getUsernameFromCookies() {
  try {
    await dbConnect();

    const token = cookies().get("token")?.value;
    if (!token || !process.env.JWT_SECRET) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    return user?.username || null;
  } catch (err) {
    console.error("getUsernameFromCookies error:", err);
    return null;
  }
}
