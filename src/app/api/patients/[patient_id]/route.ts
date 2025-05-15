import dbConnect from "../../../utils/dbConnect";
import Patient from "../../../models/Patient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { patient_id: string } }
) {
  const { patient_id } = context.params;

  try {
    await dbConnect();

    const patient = await Patient.findOne({ patient_id });

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
