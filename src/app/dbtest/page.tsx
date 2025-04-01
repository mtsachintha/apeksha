"use client";

import { useEffect, useState } from "react";
import dbConnect from "./../utils/dbConnect";
import Patient from "./../models/Patient";

interface PatientData {
  _id: string;
  basic_details: {
    title: string;
    first_name: string;
    last_name: string;
    gender: string;
    birthday: string;
    ward: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  patient_id: string;
  medical_history: {
    smoking: string;
    alcohol: string;
    chronic_illness: string[];
    allergies: string[];
    previous_surgeries: string[];
  };
  family_background: { disease: string; relation: string }[];
  vitals: {
    weight: number;
    height: number;
    blood_pressure: string;
    pulse: number;
    temperature: number;
    date: string;
    general_observations: string[];
    special_notes: string;
  }[];
  primary_diagnosis: {
    cancer_type: string;
    sub_category: string;
    stage: string;
    date_assessed: string;
    findings: string;
    suspicious_lumps: string;
    pain_assessment: string;
    consulting_doctor: string;
    notes: string;
  };
  lab_results: {
    blood_tests: string[];
    imaging_studies: string[];
    other_investigations: string[];
  };
  medications: { name: string; dosage: string; start_date: string; end_date: string }[];
  surgeries: { name: string; date: string; notes: string; complication: string }[];
  patient_log: { date: string; note: string }[];
  complications_and_risks: { date: string; complication: string; severity: string }[];
}

export default function Home() {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/patients", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Patient Records</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {patient.basic_details.title} {patient.basic_details.first_name} {patient.basic_details.last_name} <span className="text-blue-600">(ID: {patient.patient_id})</span>
              </h2>
              <p className="text-gray-600">Gender: {patient.basic_details.gender}</p>
              <p className="text-gray-600">DOB: {new Date(patient.basic_details.birthday).toLocaleDateString()}</p>
              <p className="text-gray-600">Ward: {patient.basic_details.ward}</p>
              <p className="text-gray-600">Phone: {patient.basic_details.phone}</p>
              <p className="text-gray-600">Email: {patient.basic_details.email}</p>
              <p className="text-gray-600">Address: {patient.basic_details.address}</p>
              <p className="text-gray-600">Notes: {patient.basic_details.notes}</p>
              <PatientSection title="Medical History" items={[...patient.medical_history.chronic_illness, ...patient.medical_history.allergies, ...patient.medical_history.previous_surgeries]} />
              <PatientSection title="Family Background" items={patient.family_background.map(fb => `${fb.disease} - ${fb.relation}`)} />
              <PatientSection title="Diagnosis" items={[`${patient.primary_diagnosis.cancer_type} (Stage ${patient.primary_diagnosis.stage})`]} />
              <PatientSection title="Lab Results" items={[...patient.lab_results.blood_tests, ...patient.lab_results.imaging_studies, ...patient.lab_results.other_investigations]} />
              <PatientSection title="Medications" items={patient.medications.map(m => `${m.name} - ${m.dosage}`)} />
              <PatientSection title="Surgeries" items={patient.surgeries.map(s => `${s.name} - ${new Date(s.date).toLocaleDateString()}`)} />
              <PatientSection title="Patient Log" items={patient.patient_log.map(log => `${new Date(log.date).toLocaleDateString()} - ${log.note}`)} />
              <PatientSection title="Complications & Risks" items={patient.complications_and_risks.map(c => `${new Date(c.date).toLocaleDateString()} - ${c.complication} (Severity: ${c.severity})`)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PatientSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-1 pl-5">
          {items.map((item, index) => (
            <li key={index} className="text-gray-600 text-sm">• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm pl-5">No {title.toLowerCase()} recorded</p>
      )}
    </div>
  );
}