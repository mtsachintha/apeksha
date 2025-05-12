import { NextResponse } from "next/server";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/dbConnect";

export async function POST(req) {
  
  try {
    await dbConnect();

    // Validate request content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 415 }
      );
    }

    const { username, password } = await req.json();

    // Validate input
    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user (case insensitive)
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      throw new Error("Server configuration error");
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Create HTTP-only cookie
    const response = NextResponse.json(
      { 
        success: true, 
        user: {
          id: user._id,
          username: user.username
        }
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}