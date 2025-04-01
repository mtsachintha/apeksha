import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  basic_details: {
    title: String,
    first_name: String,
    last_name: String,
    gender: String,
    birthday: Date,
    ward: String,
    phone: String,
    email: String,
    address: String,
    notes: String,
  },
  patient_id: { type: String, required: true, unique: true },
  medical_history: {
    smoking: String,
    alcohol: String,
    chronic_illness: [String],
    allergies: [String],
    previous_surgeries: [String],
  },
  family_background: [
    {
      disease: String,
      relation: String,
    },
  ],
  vitals: [
    {
      weight: Number,
      height: Number,
      blood_pressure: String,
      pulse: Number,
      temperature: Number,
      date: Date,
      general_observations: [String],
      special_notes: String,
    },
  ],
  primary_diagnosis: {
    cancer_type: String,
    sub_category: String,
    stage: String,
    date_assessed: Date,
    findings: String,
    suspicious_lumps: String,
    pain_assessment: String,
    consulting_doctor: String,
    notes: String,
  },
  lab_results: {
    blood_tests: [String],
    imaging_studies: [String],
    other_investigations: [String],
  },
  medications: [
    {
      name: String,
      dosage: String,
      start_date: Date,
      end_date: Date,
    },
  ],
  surgeries: [
    {
      name: String,
      date: Date,
      notes: String,
      complication: String,
    },
  ],
  patient_log: [
    {
      date: Date,
      note: String,
    },
  ],
  complications_and_risks: [
    {
      date: Date,
      complication: String,
      severity: String,
    },
  ],
});

// Prevent model re-registration during hot reloads in development
export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);