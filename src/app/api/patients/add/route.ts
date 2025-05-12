// app/api/patients/add/route.ts
import { NextResponse } from 'next/server';
import Patient from "../../../models/Patient";
import connectDB from "../../../utils/dbConnect";
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();
    
    // Parse request data
    const requestData = await request.json();
    console.log("Received data:", JSON.stringify(requestData, null, 2));

    // Minimal validation
    if (!requestData?.patient_id) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 }
      );
    }

    // Check for existing patient
    const existingPatient = await Patient.findOne({ 
      patient_id: requestData.patient_id 
    });
    
    if (existingPatient) {
      return NextResponse.json(
        { success: false, error: "Patient ID already exists" },
        { status: 400 }
      );
    }

    // Create minimal patient document
    const patientDoc = {
      patient_id: requestData.patient_id,
      status: 'Active',
      basic_details: {
        first_name: requestData.basic_details?.first_name || '',
        last_name: requestData.basic_details?.last_name || '',
        gender: requestData.basic_details?.gender || '',
        ward: requestData.basic_details?.ward || 'Ward-1',
        email: requestData.basic_details?.email || 'temp@example.com',
        city: requestData.basic_details?.city || ''
      }
    };

    console.log("Creating patient with:", JSON.stringify(patientDoc, null, 2));
    
    const newPatient = new Patient(patientDoc);
    const savedPatient = await newPatient.save();
    
    return NextResponse.json(
      { success: true, data: savedPatient },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Full error:", error);
    
    // Special handling for Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          validationErrors: errors 
        },
        { status: 400 }
      );
    }
    
    // For all other errors
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}