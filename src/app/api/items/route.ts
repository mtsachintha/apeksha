import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb"; // Correct path

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection("patients").find({}).toArray();

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
