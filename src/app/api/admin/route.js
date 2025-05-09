import { NextResponse } from "next/server";
import User from "../../models/User";
import dbConnect from "../../utils/dbConnect";
import { verifyAdmin } from "../../middleware/verifyAdmin";
import { getUsernameFromCookies } from "../../utils/getUserFromCookies";


// Get all users (admin only)
export async function GET(req) {
  try {
    await dbConnect();
    
    // Verify admin
    // const adminCheck = await verifyAdmin(req);
    // if (!adminCheck.isValid) {
    //   return adminCheck.response;
    // }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'All';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build query
    const query = {};
    if (status !== 'All') {
      query.status = status;
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -__v')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user status (admin only)
export async function PATCH(req) {
  try {
    await dbConnect();
    
    // Verify admin
    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isValid) {
      return adminCheck.response;
    }

    const { userId, status } = await req.json();

    if (!userId || !['Approved', 'Rejected', 'Waiting'].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password -__v');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error("User status update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(req) {
  try {
    await dbConnect();
    
    // Verify admin
    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isValid) {
      return adminCheck.response;
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}