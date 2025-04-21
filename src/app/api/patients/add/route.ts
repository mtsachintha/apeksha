import { NextResponse } from 'next/server';
import Patient from "../../../models/Patient";
import connectDB from "../../../utils/dbConnect";


export async function POST(request: Request) {
  console.log('Received request to add patient');
  
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    console.log('Parsing request body...');
    const requestData = await request.json();
    console.log('Request data:', requestData);

    // Validate required fields
    if (!requestData.patient_id) {
      console.log('Validation failed - missing patient_id');
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 }
      );
    }

    console.log('Checking for existing patient with ID:', requestData.patient_id);
    const existingPatient = await Patient.findOne({ 
      patient_id: requestData.patient_id 
    });
    
    if (existingPatient) {
      console.log('Patient ID already exists');
      return NextResponse.json(
        { success: false, error: "Patient ID already exists" },
        { status: 400 }
      );
    }

    console.log('Creating new patient document...');
    const newPatient = new Patient({
      ...requestData,
      status: "Active",
      medical_history: {
        smoking: "Unknown",
        alcohol: "Unknown",
        chronic_illness: [],
        allergies: [],
        previous_surgeries: []
      }
    });

    console.log('Saving patient to database...');
    const savedPatient = await newPatient.save();
    console.log('Patient saved successfully:', savedPatient);
    
    return NextResponse.json(
      { success: true, data: savedPatient },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('SERVER ERROR DETAILS:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}