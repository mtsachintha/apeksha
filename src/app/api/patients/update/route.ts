// app/api/patients/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Patient from "../../../models/Patient";
import dbConnect from "../../../utils/dbConnect";

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { patient_id } = body;

    if (!patient_id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const deleted = await Patient.findOneAndDelete({ patient_id });

    if (!deleted) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient deleted successfully', data: deleted }, { status: 200 });
  } catch (err) {
    console.error('Error deleting patient:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
