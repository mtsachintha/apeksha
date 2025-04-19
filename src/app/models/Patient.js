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
  patient_id: { type: String, required: true, unique: true, index: true },
  status: { type: String },
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
  vitals: {
    type: Map,
    of: new mongoose.Schema({
      weight: Number,
      height: Number,
      blood_pressure: String,
      pulse: Number,
      temperature: Number,
      general_observations: [String],
      special_notes: String,
    }, { _id: false }),
  },  
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
    blood_tests: [
      {
        name: String,
        result: String,
      },
    ],
    imaging_studies: [
      {
        name: String,
        result: String,
      },
    ],
    other_investigations: [
      {
        name: String,
        result: String,
      },
    ],
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
const Patient = mongoose.models?.Patient || mongoose.model('Patient', PatientSchema);

export default Patient;