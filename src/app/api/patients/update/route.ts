import { NextRequest, NextResponse } from 'next/server';
import Patient from "../../../models/Patient";
import dbConnect from "../../../utils/dbConnect";

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { patient_id, ...rest } = body;

    if (!patient_id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const updated = await Patient.findOneAndUpdate(
  { patient_id },
  { $set: rest },
  { new: true }
);


    if (!updated) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('Error replacing patient:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
