import dbConnect from "../../../utils/dbConnect";
import Patient from "../../../models/Patient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { patient_id: string } }
) {
  const patient_id = params.patient_id;

  try {
    await dbConnect();

    if (!patient_id) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const patient = await Patient.findOne({ patient_id });

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
