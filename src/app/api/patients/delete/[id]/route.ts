// app/api/patients/delete/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../utils/dbConnect';
import Patient from '../../../../models/Patient';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const deletedPatient = await Patient.findOneAndDelete({ patient_id: id });

    if (!deletedPatient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedPatient },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
