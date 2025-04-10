import { NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Parse request body
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Username must be between 3-30 characters" 
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Password must be at least 8 characters long" 
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Username already exists" 
        },
        { status: 409 } // 409 Conflict is more appropriate for duplicate resources
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security

    // Create new user
    const newUser = new User({ 
      username, 
      password: hashedPassword,
      createdAt: new Date() 
    });

    await newUser.save();

    // Return success response without sensitive data
    return NextResponse.json(
      { 
        success: true, 
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          createdAt: newUser.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && {
          error: error instanceof Error ? error.message : "Unknown error"
        })
      },
      { status: 500 }
    );
  }
}