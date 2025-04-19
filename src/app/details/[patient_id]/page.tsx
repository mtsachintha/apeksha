"use client";

import dbConnect from "../../utils/dbConnect";
import Patient from "../../models/Patient";

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { PlusCircle, Trash, Save, Check, BriefcaseMedical, SquareActivity } from "lucide-react";
import { FaUserMd, FaChevronDown, FaArrowRight, FaCalendarAlt, FaPhone, FaMapMarkerAlt } from "react-icons/fa";


interface Patient {
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
    city: string;
    blood: string;
  };
  patient_id: string;
  status: string;
  medical_history: {
    smoking: string;
    alcohol: string;
    chronic_illness: string[];
    allergies: string[];
    previous_surgeries: string[];
  };
  family_background: { disease: string; relation: string }[];
  vitals: {
    [date: string]: {
      weight: number;
      height: number;
      blood_pressure: string;
      pulse: number;
      temperature: number;
      general_observations: string[];
      special_notes: string;
    };
  };

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

const DetailsPage = () => {

  const params = useParams();
  const [patient, setPatient] = useState<Patient>({
    _id: '',
    patient_id: '',
    status: '',
    basic_details: {
      title: '',
      first_name: '',
      last_name: '',
      gender: '',
      birthday: '',
      ward: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      city: '',
      blood: '',
    },
    medical_history: {
      smoking: '',
      alcohol: '',
      chronic_illness: [],
      allergies: [],
      previous_surgeries: [],
    },
    family_background: [],
    vitals: {},
    primary_diagnosis: {
      cancer_type: '',
      sub_category: '',
      stage: '',
      date_assessed: '',
      findings: '',
      suspicious_lumps: '',
      pain_assessment: '',
      consulting_doctor: '',
      notes: '',
    },
    lab_results: {
      blood_tests: [],
      imaging_studies: [],
      other_investigations: [],
    },
    medications: [],
    surgeries: [],
    patient_log: [],
    complications_and_risks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/patients/${params.patient_id}`, {
          cache: 'no-store'
        });

        if (!res.ok) throw new Error("Failed to fetch patient data");

        const { data } = await res.json();
        setPatient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [params.patient_id]); // Re-fetch when patient_id changes

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSubSection, setActiveSubSection] = useState("demographics");
  const [menuOpen, setMenuOpen] = useState(false);


  // Family History
  const [familyHistory, setFamilyHistory] = useState([{ condition: "", relation: "" }]);
  const addFamilyRecord = () => {
    setFamilyHistory([...familyHistory, { condition: "", relation: "" }]);
  };
  const removeFamilyRecord = (index: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== index));
  };

  const [medications, setMedications] = useState(patient.medications || []);

  useEffect(() => {
    setMedications(patient.medications || []);
  }, [patient.medications]);

  const addMedication = () => {
    setMedications((prev) => [
      ...prev,
      { name: '', dosage: '', start_date: '', end_date: '' },
    ]);
  };

  const removeMedication = (index: number) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const updateMedications = () => {
    setPatient((prev) => ({
      ...prev,
      medications: medications.map((med) => ({
        ...med,
        start_date: new Date(med.start_date).toISOString(),
        end_date: new Date(med.end_date).toISOString(),
      })),
    }));
  };

  // Surgeries Performed
  const [surgeriesPerformed, setSurgeriesPerformed] = useState(patient.surgeries || []);

  useEffect(() => {
    setSurgeriesPerformed(patient.surgeries || []);
  }, [patient.surgeries]);

  const addSurgeryPerformed = () => {
    setSurgeriesPerformed(prev => [
      ...prev,
      { name: '', date: '', notes: '', complication: '' },
    ]);
  };

  const removeSurgeryPerformed = (index: number) => {
    const updated = [...surgeriesPerformed];
    updated.splice(index, 1);
    setSurgeriesPerformed(updated);
  };

  const updateSurgeriesPerformed = () => {
    setPatient(prev => ({
      ...prev,
      surgeries: surgeriesPerformed.map(surgery => ({
        ...surgery,
        date: new Date(surgery.date).toISOString(),
      })),
    }));
  };


  // Patient Records
  const [patientRecords, setPatientRecords] = useState(patient.patient_log || []);

  useEffect(() => {
    setPatientRecords(patient.patient_log || []);
  }, [patient.patient_log]);

  const addPatientRecord = () => {
    setPatientRecords(prev => [...prev, { date: '', note: '' }]);
  };

  const removePatientRecord = (index: number) => {
    const updated = [...patientRecords];
    updated.splice(index, 1);
    setPatientRecords(updated);
  };

  const updatePatientRecords = () => {
    setPatient(prev => ({
      ...prev,
      patient_log: patientRecords.map((record) => ({
        ...record,
        date: new Date(record.date).toISOString(),
      })),
    }));
  };


  // Add a complication record
  const [complicationRecords, setComplicationRecords] = useState(patient.complications_and_risks || []);

  useEffect(() => {
    setComplicationRecords(patient.complications_and_risks || []);
  }, [patient.complications_and_risks]);

  const addComplicationRecord = () => {
    setComplicationRecords(prev => [
      ...prev,
      { date: '', complication: '', severity: 'normal' }
    ]);
  };

  const removeComplicationRecord = (index: number) => {
    const updated = [...complicationRecords];
    updated.splice(index, 1);
    setComplicationRecords(updated);
  };

  const updateComplicationRecords = () => {
    setPatient(prev => ({
      ...prev,
      complications_and_risks: complicationRecords.map(r => ({
        ...r,
        date: new Date(r.date).toISOString()
      }))
    }));
  };



  //chronicIllnesses
  const [chronicIllnesses, setChronicIllnesses] = useState([""]);
  const addIllness = () => {
    setChronicIllnesses([...chronicIllnesses, ""]);
  };
  const removeIllness = (index: number) => {
    setChronicIllnesses(chronicIllnesses.filter((_, i) => i !== index));
  };
  const updateIllnesses = () => {
    console.log("Updated illnesses:", chronicIllnesses);
  };

  //allergies
  const [allergies, setAllergies] = useState([""]);

  const addAllergy = () => {
    setAllergies([...allergies, ""]);
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const updateAllergies = () => {
    console.log("Updated illnesses:", allergies);
  };

  //surgeries
  const [previousSurgeries, setPreviousSurgeries] = useState([""]);
  const addSurgery = () => {
    setPreviousSurgeries([...previousSurgeries, ""]);
  };
  const removeSurgery = (index: number) => {
    setPreviousSurgeries(previousSurgeries.filter((_, i) => i !== index));
  };
  const updateSurgeries = () => {
    // Add your update logic here
  };

  // Blood Tests
  const [bloodTests, setBloodTests] = useState([{ name: "", result: "" }]);

  const addBloodTest = () => {
    setBloodTests([...bloodTests, { name: "", result: "" }]);
  };

  const removeBloodTest = (index: number) => {
    setBloodTests(bloodTests.filter((_, i) => i !== index));
  };

  const updateBloodTest = (index: number, field: "name" | "result", value: string) => {
    setBloodTests(
      bloodTests.map((test, i) => (i === index ? { ...test, [field]: value } : test))
    );
  };

  // Imaging Studies
  const [imagingStudies, setImagingStudies] = useState([{ name: "", result: "" }]);

  const addImagingStudy = () => {
    setImagingStudies([...imagingStudies, { name: "", result: "" }]);
  };

  const removeImagingStudy = (index: number) => {
    setImagingStudies(imagingStudies.filter((_, i) => i !== index));
  };

  const updateImagingStudy = (index: number, field: "name" | "result", value: string) => {
    setImagingStudies(
      imagingStudies.map((study, i) => (i === index ? { ...study, [field]: value } : study))
    );
  };

  // Other Investigations
  const [otherInvestigations, setOtherInvestigations] = useState([{ name: "", result: "" }]);

  const addInvestigation = () => {
    setOtherInvestigations([...otherInvestigations, { name: "", result: "" }]);
  };

  const removeInvestigation = (index: number) => {
    setOtherInvestigations(otherInvestigations.filter((_, i) => i !== index));
  };

  const updateInvestigation = (index: number, field: "name" | "result", value: string) => {
    setOtherInvestigations(
      otherInvestigations.map((investigation, i) =>
        i === index ? { ...investigation, [field]: value } : investigation
      )
    );
  };

  const [selectedDate, setSelectedDate] = useState("");
  const vitals = patient.vitals[selectedDate] || {};
  const [specialNotes, setSpecialNotes] = useState("");
  // General Inspection
  const [generalInspection, setGeneralInspection] = useState([""]);
  const addInspection = () => {
    setGeneralInspection([...generalInspection, ""]);
  };
  const removeInspection = (index: number) => {
    setGeneralInspection(generalInspection.filter((_, i) => i !== index));
  };
  const updateInspection = () => {
    // Add your update logic here
  };

  const cancerTypes = ["Breast Cancer", "Lung Cancer", "Prostate Cancer"];
  const stages = ["Stage I", "Stage II", "Stage III", "Stage IV"];
  const subStages = ["A", "B", "C", "D"];
  const [selectedCancerType, setSelectedCancerType] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedSubStage, setSelectedSubStage] = useState("");

  const saveAllTests = () => {
    // Empty function
  };

  const getAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAvatarImage = () => {
    const age = getAge(patient.basic_details.birthday);
    const gender = patient.basic_details.gender?.toLowerCase();

    if (age <= 8) return "/baby.png";
    if (age <= 40) return gender === "male" ? "/man.png" : "/woman.png";
    return gender === "male" ? "/old_man.png" : "/old_woman.png";
  };

  const latestVitalsDate = Object.keys(patient.vitals).sort().reverse()[0];
  const latestVitals = patient.vitals[latestVitalsDate] || {};


  useEffect(() => {
    if (!patient) return;

    // Initialize blood tests
    setBloodTests(
      patient.lab_results?.blood_tests?.length > 0
        ? patient.lab_results.blood_tests.map((item: any) => ({
          name: item.name || "",
          result: item.result || "",
        }))
        : [{ name: "", result: "" }]
    );

    // Initialize imaging studies
    setImagingStudies(
      patient.lab_results?.imaging_studies?.length > 0
        ? patient.lab_results.imaging_studies.map((item: any) => ({
          name: item.name || "",
          result: item.result || "",
        }))
        : [{ name: "", result: "" }]
    );

    // Initialize other investigations
    setOtherInvestigations(
      patient.lab_results?.other_investigations?.length > 0
        ? patient.lab_results.other_investigations.map((item: any) => ({
          name: item.name || "",
          result: item.result || "",
        }))
        : [{ name: "", result: "" }]
    );
  }, [patient]);

  useEffect(() => {
    if (selectedDate && patient.vitals[selectedDate]) {
      const v = patient.vitals[selectedDate];
      setGeneralInspection(v.general_observations || []);
      setSpecialNotes(v.special_notes || "");
    }
  }, [selectedDate, patient.vitals]);


  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
        <p className="mt-2 text-gray-600">No patient found with ID: {params.patient_id}</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      {/* ✅ Header */}
      <header className="bg-gradient-to-r from-blue-100 to-blue-300 text-white px-6 py-4 flex justify-between items-center shadow-xl">
        <img
          src="/logo_main.png"
          alt="Logo"
          className="h-12 transition-all hover:scale-105 hover:rotate-2 duration-300"
        />
        <div className="flex items-center space-x-4 bg-blue-800 px-4 py-2 rounded-full">
          <FaUserMd className="text-xl" />
          <span className="text-md font-semibold">Dr. John Doe</span>
        </div>
      </header>

      {/* Patient Profile */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-6 flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
            <img src={getAvatarImage()} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800"> {patient.basic_details.first_name} {" "}  {patient.basic_details.last_name} </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                {new Date(patient.basic_details.birthday).toLocaleDateString('en-AU')} ({getAge(patient.basic_details.birthday)} y.o) | {patient.basic_details.gender}
              </span>

              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {patient.basic_details.address}, {patient.basic_details.city}
              </span>

              <span className="flex items-center">
                <FaPhone className="mr-2 text-blue-500" />
                {patient.basic_details.phone} (Mobile)
              </span>

            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {['Dashboard', 'Details', 'Clinical'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab.toLowerCase());

                  if (tab === "Details") {
                    setActiveSubSection("demographics");
                  } else if (tab === "Clinical") {
                    setActiveSubSection("primarydiagnosis");
                  }
                }}
                className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors duration-200 ${activeTab === tab.toLowerCase()
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden px-4 py-2 bg-blue-50 border-b">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Menu</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === "dashboard" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Patient Data */}
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Patient Data</h2>
                <p><strong>Name:</strong> {patient.basic_details.first_name} {patient.basic_details.last_name}</p>
                <p><strong>Patient ID:</strong> {patient.patient_id}</p>
                <p><strong>Blood Group:</strong> {patient.basic_details.blood}</p>
                <p><strong>Phone:</strong> {patient.basic_details.phone}</p>
                <p><strong>Email:</strong> {patient.basic_details.email}</p>
              </div>

              {/* Last Vitals */}
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Last Vitals</h2>
                <p><strong>Date:</strong> {latestVitalsDate}</p>
                <p><strong>Weight:</strong> {latestVitals.weight} Kg</p>
                <p><strong>Height:</strong> {latestVitals.height} cm</p>
                <p><strong>Blood Pressure:</strong> {latestVitals.blood_pressure}</p>
                <p><strong>Pulse:</strong> {latestVitals.pulse}</p>
              </div>


              {/* Major Problems */}
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Primary Diagnosis</h2>
                <p><strong>Cancer Type:</strong> {patient.primary_diagnosis.cancer_type}</p>
                <p><strong>Stage:</strong> {patient.primary_diagnosis.stage}</p>
                <p><strong>Date Assessed:</strong> {new Date(patient.primary_diagnosis.date_assessed).toLocaleDateString()}</p>
                <p><strong>Consulting Doctor:</strong> {patient.primary_diagnosis.consulting_doctor}</p>
              </div>
            </div>

            {/* Lab Results & Chronic Medication */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Lab Results</h2>
                {patient.lab_results?.blood_tests?.[0] && (
                  <p>
                    <strong>Blood:</strong>{" "}
                    {(patient.lab_results.blood_tests[0] as any)?.name} – {(patient.lab_results.blood_tests[0] as any)?.result}
                  </p>
                )}
                {patient.lab_results?.imaging_studies?.[0] && (
                  <p>
                    <strong>Imaging:</strong>{" "}
                    {(patient.lab_results.imaging_studies[0] as any)?.name} – {(patient.lab_results.imaging_studies[0] as any)?.result}
                  </p>
                )}
                {patient.lab_results?.other_investigations?.[0] && (
                  <p>
                    <strong>Other:</strong>{" "}
                    {(patient.lab_results.other_investigations[0] as any)?.name} – {(patient.lab_results.other_investigations[0] as any)?.result}
                  </p>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Chronic Medication</h2>
                {patient.medications?.slice(0, 3).map((med, index) => (
                  <p key={index}><strong>{med.name}:</strong> {med.dosage}</p>
                ))}

              </div>
            </div>

            {/* Last Visit */}
            <div className="bg-white p-4 rounded-lg shadow mt-4 text-gray-500">
              <h2 className="font-semibold text-gray-700">Patient Log</h2>
              {patient.patient_log.slice(0, 4).map(log => {
                const date = new Date(log.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <p><strong>{formattedDate} - </strong> {log.note}</p>
                );
              })}


            </div>

            {/* Export Button */}
            <div className="mt-4 text-right">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className={`md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden ${menuOpen ? "block" : "hidden"} md:block`}>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-700">Details</h3>
              </div>
              <div className="space-y-1 p-2">
                <button
                  onClick={() => setActiveSubSection("demographics")}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-2 ${activeSubSection === "demographics"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Demographics
                </button>
                <button
                  onClick={() => setActiveSubSection("social")}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-2 ${activeSubSection === "social"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Medical History
                </button>
                <button
                  onClick={() => setActiveSubSection("background")}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-2 ${activeSubSection === "background"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Family Background
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-6">
              {/* Demographics Section */}
              {activeSubSection === "demographics" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Demographics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <select
                            className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={patient.basic_details.title}
                            onChange={(e) =>
                              setPatient((prev) => ({
                                ...prev,
                                basic_details: {
                                  ...prev.basic_details,
                                  title: e.target.value,
                                },
                              }))
                            }
                          >
                            <option value="">None</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Mr">Mr.</option>
                            <option value="Ms">Ms.</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={patient.basic_details.first_name}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    basic_details: {
                                      ...prev.basic_details,
                                      first_name: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={patient?.basic_details.birthday
                              ? patient.basic_details.birthday.split('T')[0]  // Extract YYYY-MM-DD
                              : ''}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    basic_details: {
                                      ...prev.basic_details,
                                      birthday: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 bg-white"
                          />
                        </div>

                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={patient.basic_details.last_name}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    basic_details: {
                                      ...prev.basic_details,
                                      last_name: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={patient?.basic_details.gender || ''}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    basic_details: {
                                      ...prev.basic_details,
                                      gender: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                          >
                            <option value="">Other</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                          <input
                            type="text"
                            value={patient?.basic_details.phone || ''}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    basic_details: {
                                      ...prev.basic_details,
                                      phone: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 bg-white"
                          />
                        </div>

                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        placeholder="Enter Address"
                        type="text"
                        value={patient?.basic_details.address || ''}
                        onChange={(e) =>
                          setPatient((prev) =>
                            prev
                              ? {
                                ...prev,
                                basic_details: {
                                  ...prev.basic_details,
                                  address: e.target.value,
                                },
                              }
                              : prev
                          )
                        }
                        className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 bg-white"
                      />

                      <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">City</label>
                      <input
                        placeholder="City"
                        type="text"
                        value={patient?.basic_details.city || ''}
                        onChange={(e) =>
                          setPatient((prev) =>
                            prev
                              ? {
                                ...prev,
                                basic_details: {
                                  ...prev.basic_details,
                                  city: e.target.value,
                                },
                              }
                              : prev
                          )
                        }
                        className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 bg-white"
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="text-l font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Notes
                      </h3>
                      <textarea
                        placeholder="Enter Notes"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        value={patient?.basic_details.notes || ''}
                        onChange={(e) =>
                          setPatient((prev) =>
                            prev
                              ? {
                                ...prev,
                                basic_details: {
                                  ...prev.basic_details,
                                  notes: e.target.value,
                                },
                              }
                              : prev
                          )
                        }
                      />
                    </div>

                    <div className="w-full border-t border-gray-300 mt-4"></div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={updateSurgeries}
                        className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Check size={20} className="mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical History Section */}
              {activeSubSection === "social" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Medical History
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <fieldset className="space-y-3">
                          <legend className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                              />
                            </svg>
                            Smoking
                          </legend>
                          <div className="space-y-2">
                            {['Non Smoker', 'Ex Smoker', 'Smoker'].map((option) => (
                              <label key={option} className="flex items-center space-x-3 text-gray-700">
                                <input
                                  type="radio"
                                  name="smoking"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                  checked={patient?.medical_history.smoking === option}
                                  onChange={() =>
                                    setPatient((prev) =>
                                      prev
                                        ? {
                                          ...prev,
                                          medical_history: {
                                            ...prev.medical_history,
                                            smoking: option,
                                          },
                                        }
                                        : prev
                                    )
                                  }
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </div>

                      <div>
                        <fieldset className="space-y-3">
                          <legend className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            Alcohol
                          </legend>
                          <div className="space-y-2">
                            {['Non Drinker', 'Ex Drinker', 'Drinker'].map((option) => (
                              <label key={option} className="flex items-center space-x-3 text-gray-700">
                                <input
                                  type="radio"
                                  name="alcohol"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                  checked={patient?.medical_history.alcohol === option}
                                  onChange={() =>
                                    setPatient((prev) =>
                                      prev
                                        ? {
                                          ...prev,
                                          medical_history: {
                                            ...prev.medical_history,
                                            alcohol: option,
                                          },
                                        }
                                        : prev
                                    )
                                  }
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </div>


                    <div className="mt-8 space-y-6">
                      {/* Chronic Illnesses */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          Chronic Illnesses
                        </h4>

                        {chronicIllnesses.map((illness, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              placeholder="Enter chronic illness"
                              value={illness}
                              onChange={(e) => {
                                const newIllnesses = [...chronicIllnesses];
                                newIllnesses[index] = e.target.value;
                                setChronicIllnesses(newIllnesses);
                              }}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {chronicIllnesses.length > 1 && (
                              <button
                                onClick={() => removeIllness(index)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                              >
                                <Trash size={18} />
                              </button>
                            )}
                          </div>
                        ))}

                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={addIllness}
                            className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <PlusCircle size={20} className="mr-2" />
                            Add More
                          </button>

                          <button
                            onClick={updateIllnesses}
                            className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                          >
                            <Save size={20} className="mr-2" />
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Allergies */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Allergies
                        </h4>

                        {allergies.map((allergy, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              placeholder="Enter allergy"
                              value={allergy}
                              onChange={(e) => {
                                const newAllergies = [...allergies];
                                newAllergies[index] = e.target.value;
                                setAllergies(newAllergies);
                              }}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {allergies.length > 1 && (
                              <button
                                onClick={() => removeAllergy(index)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                              >
                                <Trash size={18} />
                              </button>
                            )}
                          </div>
                        ))}

                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={addAllergy}
                            className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <PlusCircle size={20} className="mr-2" />
                            Add More
                          </button>

                          <button
                            onClick={updateAllergies}
                            className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                          >
                            <Save size={20} className="mr-2" />
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Previous Surgeries */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Previous Surgeries
                        </h4>

                        {previousSurgeries.map((surgery, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              placeholder="Enter previous surgery"
                              value={surgery}
                              onChange={(e) => {
                                const newSurgeries = [...previousSurgeries];
                                newSurgeries[index] = e.target.value;
                                setPreviousSurgeries(newSurgeries);
                              }}
                              className="w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {previousSurgeries.length > 1 && (
                              <button
                                onClick={() => removeSurgery(index)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                              >
                                <Trash size={18} />
                              </button>
                            )}
                          </div>
                        ))}

                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={addSurgery}
                            className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <PlusCircle size={20} className="mr-2" />
                            Add More
                          </button>

                          <button
                            onClick={updateSurgeries}
                            className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                          >
                            <Save size={20} className="mr-2" />
                            Update
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Divider */}
                    <div className="w-full border-t border-gray-300 mt-4"></div>

                    {/* Button Section */}
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={updateSurgeries}
                        className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Check size={20} className="mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Family Background Section */}
              {activeSubSection === "background" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Family Background
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hereditary Condition
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Relation
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {familyHistory.map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  placeholder="E.g., Diabetes"
                                  value={record.condition}
                                  onChange={(e) => {
                                    const newHistory = [...familyHistory];
                                    newHistory[index].condition = e.target.value;
                                    setFamilyHistory(newHistory);
                                  }}
                                  className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="E.g., Father"
                                    value={record.relation}
                                    onChange={(e) => {
                                      const newHistory = [...familyHistory];
                                      newHistory[index].relation = e.target.value;
                                      setFamilyHistory(newHistory);
                                    }}
                                    className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  {familyHistory.length > 1 && (
                                    <button
                                      onClick={() => removeFamilyRecord(index)}
                                      className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                    >
                                      <Trash size={18} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>


                    <div className="mt-4">
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={addFamilyRecord}
                          className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <PlusCircle size={20} className="mr-2" />
                          Add More
                        </button>

                        <button
                          onClick={updateSurgeries}
                          className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                        >
                          <Save size={20} className="mr-2" />
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "clinical" && (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className={`md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden ${menuOpen ? "block" : "hidden"} md:block`}>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-700">Clinical</h3>
              </div>
              <div className="space-y-1 p-2">
                {[
                  { name: "Primary Diagnosis", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                  { name: "Investigations Ordered", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                  { name: "Vital Signs", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
                  { name: "Medications", icon: "M10.5 5.5l8 8m-3-9a5 5 0 00-7.07 0L5.5 7.93a5 5 0 000 7.07m3 3a5 5 0 007.07 0l2.43-2.43a5 5 0 000-7.07" },
                  { name: "Suregries", icon: "M3 3h18v18H3V3zm9 4v4m0 4h.01" },
                  { name: "Patient Log", icon: "M9 12h6m-3-3v6M10 4h4M12 2v4M8 2h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" },
                  { name: "Complications & Risks", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }
                ].map((section) => (
                  <button
                    key={section.name}
                    onClick={() => setActiveSubSection(section.name.toLowerCase().replace(/ /g, '').replace('-', '').replace('&', ''))}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-2 ${activeSubSection === section.name.toLowerCase().replace(/ /g, '').replace('-', '').replace('&', '')
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                    </svg>
                    {section.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-6">
              {/* Primary Diagnosis Section */}
              {activeSubSection === "primarydiagnosis" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Primary Diagnosis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cancer Type</label>
                        <select
                          value={patient.primary_diagnosis.cancer_type || ''}
                          onChange={(e) =>
                            setPatient((prev) => ({
                              ...prev,
                              cancerType: e.target.value,
                            }))
                          }
                          className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {cancerTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                          value={patient.primary_diagnosis.stage}
                          onChange={(e) =>
                            setPatient((prev) => ({
                              ...prev,
                              stage: e.target.value,
                            }))
                          }
                          className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {stages.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Stage</label>
                        <select
                          value={patient.primary_diagnosis.sub_category}
                          onChange={(e) =>
                            setPatient((prev) => ({
                              ...prev,
                              primary_diagnosis: {
                                ...prev.primary_diagnosis,
                                sub_category: e.target.value,
                              },
                            }))
                          }
                          className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {subStages.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Assessed</label>
                        <input
                          type="date"
                          value={
                            patient.primary_diagnosis.date_assessed
                              ? patient.primary_diagnosis.date_assessed.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setPatient((prev) => ({
                              ...prev,
                              primary_diagnosis: {
                                ...prev.primary_diagnosis,
                                date_assessed: e.target.value,
                              },
                            }))
                          }
                          className="w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                        />
                      </div>

                    </div>

                    <div className="mt-6">
                      <h4 className="text-l font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Initial Physical Examination
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Findings</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.findings}
                            placeholder="Enter findings"
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Suspicious Lumps</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.suspicious_lumps}
                            placeholder="Enter details about suspicious lumps"
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pain Assessment</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.pain_assessment}
                            placeholder="Enter pain assessment details"
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>


                    <div className="mt-6">
                      <h4 className="text-l font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Referring Physician & Notes
                      </h4>

                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Consulting Doctor</label>
                          <input
                            type="text"
                            defaultValue={patient.primary_diagnosis.consulting_doctor}
                            className="w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.notes}
                            placeholder="Enter physician notes"
                            className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full border-t border-gray-300 mt-4"></div>


                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={updateSurgeries}
                        className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Check size={20} className="mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Investigations Ordered Section */}
              {activeSubSection === "investigationsordered" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Blood Tests
                    </h3>
                    <div>
                      {bloodTests?.map((test, index) => (
                        <div key={`blood-test-${index}`} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Test Name"
                            value={test?.name || ''}
                            onChange={(e) => updateBloodTest(index, "name", e.target.value)}
                            className="w-1/2 text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Result"
                            value={test?.result || ''}
                            onChange={(e) => updateBloodTest(index, "result", e.target.value)}
                            className="w-1/2 text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {bloodTests.length > 1 && (
                            <button
                              onClick={() => removeBloodTest(index)}
                              className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <Trash size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 3 0 016 0z" />
                      </svg>
                      Imaging Studies
                    </h3>
                    <div>
                      {imagingStudies?.map((study, index) => (
                        <div key={`imaging-study-${index}`} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Study Name"
                            value={study?.name || ''}
                            onChange={(e) => updateImagingStudy(index, "name", e.target.value)}
                            className="w-1/2 text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Result"
                            value={study?.result || ''}
                            onChange={(e) => updateImagingStudy(index, "result", e.target.value)}
                            className="w-1/2 text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {imagingStudies.length > 1 && (
                            <button
                              onClick={() => removeImagingStudy(index)}
                              className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <Trash size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Other Investigations
                    </h3>
                    <div>
                      {otherInvestigations?.map((investigation, index) => (
                        <div key={`investigation-${index}`} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Investigation Name"
                            value={investigation?.name || ''}
                            onChange={(e) => updateInvestigation(index, "name", e.target.value)}
                            className="w-1/2 text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Result"
                            value={investigation?.result || ''}
                            onChange={(e) => updateInvestigation(index, "result", e.target.value)}
                            className="w-1/2 text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {otherInvestigations.length > 1 && (
                            <button
                              onClick={() => removeInvestigation(index)}
                              className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <Trash size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Observations Section */}
              {activeSubSection === "vitalsigns" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-l font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 3 0 016 0z" />
                        </svg>
                        Observations
                      </h3>
                      <select
                        className="border border-gray-300 rounded px-3 py-1 text-gray-700"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      >
                        <option value="">Select Date</option>
                        {Object.keys(patient.vitals).map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>

                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Vital Signs
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                            <input
                              type="text"
                              placeholder="e.g., 120/80"
                              value={vitals.blood_pressure || ""}
                              readOnly
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                            <input
                              type="text"
                              placeholder="e.g., 72 bpm"
                              value={vitals.pulse?.toString() || ""}
                              readOnly
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                            <input
                              type="text"
                              placeholder="e.g., 98.6°F"
                              value={vitals.temperature?.toString() || ""}
                              readOnly
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                          <input
                            type="text"
                            placeholder="e.g., 120/80"
                            value={vitals.weight?.toString() || ""}
                            readOnly
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                          <input
                            type="text"
                            placeholder="e.g., 120/80"
                            value={vitals.height?.toString() || ""}
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          General Observations
                        </h4>
                        <div>
                          {generalInspection.map((inspection, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                              <input
                                type="text"
                                placeholder="Enter general inspection"
                                value={inspection}
                                onChange={(e) => {
                                  const newInspection = [...generalInspection];
                                  newInspection[index] = e.target.value;
                                  setGeneralInspection(newInspection);
                                }}
                                className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {generalInspection.length > 1 && (
                                <button
                                  onClick={() => removeInspection(index)}
                                  className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                >
                                  <Trash size={18} />
                                </button>
                              )}
                            </div>
                          ))}


                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              onClick={addInspection}
                              className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              <PlusCircle size={20} className="mr-2" />
                              Add More
                            </button>

                            <button
                              onClick={updateInspection}
                              className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                            >
                              <Save size={20} className="mr-2" />
                              Update
                            </button>
                          </div>
                        </div>

                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Special Notes
                        </h4>
                        <textarea
                          placeholder="Enter any special notes"
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />

                      </div>
                    </div>
                    <div className="w-full border-t border-gray-300 mt-4"></div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={updateSurgeries}
                        className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Check size={20} className="mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSubSection === "medications" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                  <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Medications
                  </h3>

                  <div className="space-y-4">
                    {medications.map((medication, index) => (
                      <div key={index} className="p-4 border border-gray-300 rounded-md space-y-2">
                        <input
                          type="text"
                          placeholder="E.g., Paracetamol"
                          value={medication.name}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].name = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="E.g., 500mg"
                          value={medication.dosage}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].dosage = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={medication.start_date?.slice(0, 10) || ''}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].start_date = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={medication.end_date?.slice(0, 10) || ''}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].end_date = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {medications.length > 1 && (
                          <button
                            onClick={() => removeMedication(index)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors w-full text-center"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col space-y-2">
                    <button
                      onClick={addMedication}
                      className="flex items-center justify-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors w-full"
                    >
                      <PlusCircle size={20} className="mr-2" />
                      Add More
                    </button>
                    <div className="w-full border-t border-gray-300 mt-4"></div>

                    <button
                      onClick={updateMedications}
                      className="flex items-center justify-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors w-full"
                    >
                      <Check size={20} className="mr-2" />
                      Save
                    </button>
                  </div>
                </div>

              )}

              {activeSubSection === "suregries" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                  <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Surgeries Performed
                  </h3>

                  <div className="space-y-4">
                    {surgeriesPerformed.map((surgery, index) => (
                      <div key={index} className="p-4 border border-gray-300 rounded-md space-y-2">
                        <input
                          type="text"
                          placeholder="E.g., Appendectomy"
                          value={surgery.name}
                          onChange={(e) => {
                            const updated = [...surgeriesPerformed];
                            updated[index].name = e.target.value;
                            setSurgeriesPerformed(updated);
                          }}
                          className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={surgery.date?.slice(0, 10) || ''}
                          onChange={(e) => {
                            const updated = [...surgeriesPerformed];
                            updated[index].date = e.target.value;
                            setSurgeriesPerformed(updated);
                          }}
                          className="w-ful text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          placeholder="Notes"
                          value={surgery.notes}
                          onChange={(e) => {
                            const updated = [...surgeriesPerformed];
                            updated[index].notes = e.target.value;
                            setSurgeriesPerformed(updated);
                          }}
                          className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                        <textarea
                          placeholder="Complications"
                          value={surgery.complication}
                          onChange={(e) => {
                            const updated = [...surgeriesPerformed];
                            updated[index].complication = e.target.value;
                            setSurgeriesPerformed(updated);
                          }}
                          className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                        {surgeriesPerformed.length > 1 && (
                          <button
                            onClick={() => removeSurgeryPerformed(index)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors w-full text-center"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col space-y-2">
                    <button
                      onClick={addSurgeryPerformed}
                      className="flex items-center justify-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors w-full"
                    >
                      <PlusCircle size={20} className="mr-2" />
                      Add More
                    </button>
                    <div className="w-full border-t border-gray-300 mt-4"></div>
                    <button
                      onClick={updateSurgeriesPerformed}
                      className="flex items-center justify-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors w-full"
                    >
                      <Save size={20} className="mr-2" />
                      Update
                    </button>
                  </div>
                </div>
              )}

              {activeSubSection === "patientlog" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Patient Records
                    </h3>

                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                              Note
                            </th>
                            <th className="px-6 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {patientRecords.map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="date"
                                  value={record.date ? record.date.slice(0, 10) : ''}
                                  onChange={(e) => {
                                    const newRecords = [...patientRecords];
                                    newRecords[index].date = e.target.value;
                                    setPatientRecords(newRecords);
                                  }}
                                  className="w-48 text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap" colSpan={2}>
                                <textarea
                                  placeholder="Note"
                                  value={record.note}
                                  onChange={(e) => {
                                    const newRecords = [...patientRecords];
                                    newRecords[index].note = e.target.value;
                                    setPatientRecords(newRecords);
                                  }}
                                  className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                ></textarea>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                {patientRecords.length > 1 && (
                                  <button
                                    onClick={() => removePatientRecord(index)}
                                    className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                  >
                                    <Trash size={18} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={addPatientRecord}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
                      <button
                        onClick={updatePatientRecords}
                        className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Save size={20} className="mr-2" />
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSubSection === "complicationsrisks" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6">Complications and Risks</h3>

                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Complication/Risk
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Severity
                            </th>
                            <th className="px-6 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {complicationRecords.map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="date"
                                  value={record.date ? new Date(record.date).toISOString().split('T')[0] : ''}
                                  onChange={(e) => {
                                    const newRecords = [...complicationRecords];
                                    newRecords[index].date = e.target.value;
                                    setComplicationRecords(newRecords);
                                  }}
                                  className="w-48 border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  placeholder="Complication or Risk"
                                  value={record.complication}
                                  onChange={(e) => {
                                    const newRecords = [...complicationRecords];
                                    newRecords[index].complication = e.target.value;
                                    setComplicationRecords(newRecords);
                                  }}
                                  className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={record.severity}
                                  onChange={(e) => {
                                    const newRecords = [...complicationRecords];
                                    newRecords[index].severity = e.target.value;
                                    setComplicationRecords(newRecords);
                                  }}
                                  className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="high">High</option>
                                  <option value="normal">Normal</option>
                                  <option value="low">Low</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                {complicationRecords.length > 1 && (
                                  <button
                                    onClick={() => removeComplicationRecord(index)}
                                    className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                  >
                                    <Trash size={18} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={addComplicationRecord}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
                      <button
                        onClick={updateComplicationRecords}
                        className="flex items-center text-green-600 px-4 py-2 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Save size={20} className="mr-2" />
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;