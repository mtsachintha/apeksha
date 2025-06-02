"use client";

import Patient from "../../models/Patient";

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { PlusCircle, Trash, Save, Check, BriefcaseMedical, SquareActivity } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const handlePrint = () => {
  window.print();
};

const DetailsPage = () => {

  useEffect(() => {
    document.title = 'Details';
  }, []);

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

  const [user, setUser] = useState<any>(null);
  const [medicationsPage, setMedicationsPage] = useState(1);
  const [surgeriesPage, setSurgeriesPage] = useState(1);
  const [recordsPage, setRecordsPage] = useState(1);
  const [complicationsPage, setComplicationsPage] = useState(1);

  useEffect(() => {
    fetch('/api/auth/user', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

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
  const [familyHistory, setFamilyHistory] = useState([{ disease: "", relation: "" }]);
  const addFamilyRecord = () => {
    setFamilyHistory([...familyHistory, { disease: "", relation: "" }]);
  };
  const removeFamilyRecord = (index: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (patient?.family_background) {
      setFamilyHistory(patient.family_background);
    }
  }, [patient?.family_background]); // Add dependency array

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




  // Medical History

  const [chronicIllnesses, setChronicIllnesses] = useState<string[]>(['']);
  const [allergies, setAllergies] = useState<string[]>(['']);
  const [previousSurgeries, setPreviousSurgeries] = useState<string[]>(['']);

  // Load existing data when patient changes
  useEffect(() => {
    if (patient?.medical_history) {
      setChronicIllnesses(
        patient.medical_history.chronic_illness?.length > 0
          ? [...patient.medical_history.chronic_illness, '']
          : ['']
      );
      setAllergies(
        patient.medical_history.allergies?.length > 0
          ? [...patient.medical_history.allergies, '']
          : ['']
      );
      setPreviousSurgeries(
        patient.medical_history.previous_surgeries?.length > 0
          ? [...patient.medical_history.previous_surgeries, '']
          : ['']
      );
    }
  }, [patient]);

  // Chronic Illnesses
  const addIllness = () => {
    setChronicIllnesses([...chronicIllnesses, '']);
  };

  const removeIllness = (index: number) => {
    const newIllnesses = chronicIllnesses.filter((_, i) => i !== index);
    setChronicIllnesses(newIllnesses.length > 0 ? newIllnesses : ['']);
  };

  const updateIllness = (index: number, value: string) => {
    const newIllnesses = [...chronicIllnesses];
    newIllnesses[index] = value;
    setChronicIllnesses(newIllnesses);
  };

  // Allergies
  const addAllergy = () => {
    setAllergies([...allergies, '']);
  };

  const removeAllergy = (index: number) => {
    const newAllergies = allergies.filter((_, i) => i !== index);
    setAllergies(newAllergies.length > 0 ? newAllergies : ['']);
  };

  const updateAllergy = (index: number, value: string) => {
    const newAllergies = [...allergies];
    newAllergies[index] = value;
    setAllergies(newAllergies);
  };

  // Previous Surgeries
  const addSurgery = () => {
    setPreviousSurgeries([...previousSurgeries, '']);
  };

  const removeSurgery = (index: number) => {
    const newSurgeries = previousSurgeries.filter((_, i) => i !== index);
    setPreviousSurgeries(newSurgeries.length > 0 ? newSurgeries : ['']);
  };

  const updateSurgery = (index: number, value: string) => {
    const newSurgeries = [...previousSurgeries];
    newSurgeries[index] = value;
    setPreviousSurgeries(newSurgeries);
  };

  // Save all medical history
  const saveMedicalHistory = () => {
    const nonEmptyIllnesses = chronicIllnesses.filter(i => i.trim() !== '');
    const nonEmptyAllergies = allergies.filter(a => a.trim() !== '');
    const nonEmptySurgeries = previousSurgeries.filter(s => s.trim() !== '');

    setPatient({
      ...patient,
      medical_history: {
        ...patient.medical_history,
        chronic_illness: nonEmptyIllnesses,
        allergies: nonEmptyAllergies,
        previous_surgeries: nonEmptySurgeries
      }
    });
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
  const vitals = (patient?.vitals?.[selectedDate] || {});
  const [specialNotes, setSpecialNotes] = useState("");
  const latestVitalsDate = patient?.vitals ? Object.keys(patient.vitals).sort().reverse()[0] : "";
  const latestVitals = (patient?.vitals?.[latestVitalsDate] || {});
  const handleVitalsChange = (field: string, value: string | number) => {
    setPatient((prev) =>
      prev && selectedDate
        ? {
          ...prev,
          vitals: {
            ...prev.vitals,
            [selectedDate]: {
              ...prev.vitals?.[selectedDate],
              [field]: value,
            },
          },
        }
        : prev
    );
  };


  const [vitalsForm, setVitalsForm] = useState({
    weight: "",
    height: "",
    blood_pressure: "",
    pulse: "",
    temperature: ""
  });

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


  const [isSaving, setIsSaving] = useState(false);
  const [previousPatientState, setPreviousPatientState] = useState<Patient>({
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

  const handleSave = async () => {
    setIsSaving(true);
    setPreviousPatientState(patient); // Store current state for potential rollback

    try {
      // Prepare all existing updates (unchanged)
      const updatedPatient = {
        ...patient,
        family_background: familyHistory.filter(record =>
          record.disease.trim() !== "" || record.relation.trim() !== ""
        ),
        medical_history: {
          ...patient.medical_history,
          chronic_illness: chronicIllnesses.filter(i => i.trim() !== ""),
          allergies: allergies.filter(a => a.trim() !== ""),
          previous_surgeries: previousSurgeries.filter(s => s.trim() !== "")
        },
        medications: medications
          .filter(med =>
            med.name.trim() !== "" ||
            med.dosage.trim() !== "" ||
            med.start_date.trim() !== "" ||
            med.end_date.trim() !== ""
          )
          .map((med) => ({
            name: med.name.trim(),
            dosage: med.dosage.trim(),
            start_date: med.start_date ? new Date(med.start_date).toISOString() : "",
            end_date: med.end_date ? new Date(med.end_date).toISOString() : ""
          })),
        surgeries: surgeriesPerformed
          .filter(surgery =>
            surgery.name.trim() !== "" ||
            surgery.date.trim() !== "" ||
            surgery.notes.trim() !== "" ||
            surgery.complication.trim() !== ""
          )
          .map((surgery) => ({
            name: surgery.name.trim(),
            date: surgery.date ? new Date(surgery.date).toISOString() : "",
            notes: surgery.notes.trim(),
            complication: surgery.complication.trim()
          })),
        patient_log: patientRecords
          .filter(record => record.date.trim() !== "" || record.note.trim() !== "")
          .map(record => ({
            date: record.date ? new Date(record.date).toISOString() : "",
            note: record.note.trim()
          })),
        complications_and_risks: complicationRecords
          .filter(record =>
            record.date.trim() !== "" ||
            record.complication.trim() !== "" ||
            record.severity.trim() !== ""
          )
          .map(record => ({
            date: record.date ? new Date(record.date).toISOString() : "",
            complication: record.complication.trim(),
            severity: record.severity.trim() || "normal" // Default to 'normal' if empty
          })),
        lab_results: {
          ...patient.lab_results,
          blood_tests: bloodTests.filter(test => test.name.trim() !== "" || test.result.trim() !== ""),
          imaging_studies: imagingStudies.filter(study => study.name.trim() !== "" || study.result.trim() !== ""),
          other_investigations: otherInvestigations.filter(investigation => investigation.name.trim() !== "" || investigation.result.trim() !== "")
        },
        // Add vitals integration while preserving existing structure
        vitals: {
          ...patient.vitals, // Preserve existing vitals
          ...(selectedDate && { // Only add if we have a selected date
            [selectedDate]: {
              weight: vitals.weight || 0,
              height: vitals.height || 0,
              blood_pressure: vitals.blood_pressure || "",
              pulse: vitals.pulse || 0,
              temperature: vitals.temperature || 0,
              general_observations: generalInspection.filter(obs => obs.trim() !== ""),
              special_notes: specialNotes || ""
            }
          })
        }
      };

      // Persist to server (unchanged)
      const response = await replacePatient(updatedPatient);

      // Success handling (unchanged)
      toast.success("Patient data saved successfully");
      return response;
    } catch (error) {
      // Revert on error (unchanged)
      setPatient(previousPatientState);
      toast.error("Failed to save patient data");
      console.error("Save error:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (patientId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/patients/delete/${patientId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Patient deleted successfully!");
        // Optionally refresh the list or redirect
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  async function replacePatient(patient: any) {
    try {
      const response = await fetch('/api/patients/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to replace patient');
      }

      return data;
    } catch (error) {
      console.error('Error replacing patient:', error);
      throw error;
    }
  }

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

  useEffect(() => {
    if (activeSubSection === "vitalsigns" && patient?.vitals) {
      const dates = Object.keys(patient.vitals);
      if (dates.length > 0) {
        const latestDate = dates.sort().reverse()[0];
        if (!selectedDate || !patient.vitals[selectedDate]) {
          setSelectedDate(latestDate);
        }
      }
    }
  }, [activeSubSection, patient?.vitals]);


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
          className="h-12 transition-all pointer- cursor-pointer"
        />
        {/* Existing User Profile */}
        <div className="flex items-center space-x-2 cursor-pointer bg-blue-800 hover:bg-blue-600 px-4 py-2 rounded-full text-white">
          <FaUserMd className="text-xl" />
          {user?.username && <span className="text-sm font-medium">{user?.username}</span>}
        </div>
      </header>

      {/* Patient Profile */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
            <img src={getAvatarImage()} alt="Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              {patient.basic_details.first_name}{" "}{patient.basic_details.last_name}
            </h2>

            <div className="flex flex-col sm:flex-wrap sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-gray-600 text-sm sm:text-base">

              <span className="flex items-center justify-center sm:justify-start">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                {new Date(patient.basic_details.birthday).toLocaleDateString('en-AU')} ({getAge(patient.basic_details.birthday)} y.o) | {patient.basic_details.gender}
              </span>

              <span className="flex items-center justify-center sm:justify-start">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {patient.basic_details.address}, {patient.basic_details.city}
              </span>

              <span className="flex items-center justify-center sm:justify-start">
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

            {/* Export and Delete Buttons */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(patient.patient_id)}
              >
                Delete Patient
              </button>  <button className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handlePrint}>Export</button>
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

                        {/*ward*/}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                          <select
                            className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={patient?.basic_details.ward || ''}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    basic_details: {
                                      ...prev.basic_details,
                                      ward: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                          >
                            {Array.from({ length: 20 }, (_, i) => (
                              <option key={`${i + 1}`} value={`${i + 1}`}>
                                Ward {i + 1}
                              </option>
                            ))}
                          </select>
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={patient?.status || ''}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    status: e.target.value,
                                  }
                                  : prev
                              )
                            }
                          >
                            <option value="Outpatient">Outpatient</option>
                            <option value="Inward">Inward</option>
                            <option value="Discharged">Discharged</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Transferred">Transferred</option>
                            <option value="Deceased">Deceased</option>
                          </select>
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

                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical History Section */}
              {activeSubSection === "social" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                      Medical History
                    </h3>

                    {/* Chronic Illnesses Section */}
                    <div className="mb-8">
                      <h4 className="text-md font-medium text-gray-800 mb-3">
                        Chronic Illnesses
                      </h4>

                      <div className="space-y-2">
                        {chronicIllnesses.map((illness, index) => (
                          <div key={`illness-${index}`} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={illness}
                              onChange={(e) => updateIllness(index, e.target.value)}
                              placeholder="Enter chronic illness"
                              className="flex-1 text-gray-900 border-gray-300 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => removeIllness(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                              disabled={chronicIllnesses.length <= 1}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={addIllness}
                        className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <PlusCircle size={16} className="mr-1" />
                        Add Illness
                      </button>
                    </div>

                    {/* Allergies Section */}
                    <div className="mb-8">
                      <h4 className="text-md font-medium text-gray-800 mb-3">
                        Allergies
                      </h4>

                      <div className="space-y-2">
                        {allergies.map((allergy, index) => (
                          <div key={`allergy-${index}`} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={allergy}
                              onChange={(e) => updateAllergy(index, e.target.value)}
                              placeholder="Enter allergy"
                              className="flex-1 text-gray-900 border-gray-300 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => removeAllergy(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                              disabled={allergies.length <= 1}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={addAllergy}
                        className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <PlusCircle size={16} className="mr-1" />
                        Add Allergy
                      </button>
                    </div>

                    {/* Previous Surgeries Section */}
                    <div className="mb-8">
                      <h4 className="text-md font-medium text-gray-800 mb-3">
                        Previous Surgeries
                      </h4>

                      <div className="space-y-2">
                        {previousSurgeries.map((surgery, index) => (
                          <div key={`surgery-${index}`} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={surgery}
                              onChange={(e) => updateSurgery(index, e.target.value)}
                              placeholder="Enter previous surgery"
                              className="flex-1 text-gray-900 border-gray-300 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => removeSurgery(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                              disabled={previousSurgeries.length <= 1}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={addSurgery}
                        className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <PlusCircle size={16} className="mr-1" />
                        Add Surgery
                      </button>
                    </div>

                    <div className="w-full border-t border-gray-300 mt-4"></div>

                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
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
                                  value={record.disease}
                                  onChange={(e) => {
                                    const newHistory = [...familyHistory];
                                    newHistory[index].disease = e.target.value;
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
                      </div>

                      <div className="w-full border-t border-gray-300 mt-4"></div>

                      <div className="flex justify-center mt-4 w-full">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                            }`}
                        >
                          {isSaving ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Save
                            </>
                          )}
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
                            setPatient((prev) =>
                              prev
                                ? {
                                  ...prev,
                                  primary_diagnosis: {
                                    ...prev.primary_diagnosis,
                                    cancer_type: e.target.value,
                                  },
                                }
                                : prev
                            )
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
                            setPatient((prev) =>
                              prev
                                ? {
                                  ...prev,
                                  primary_diagnosis: {
                                    ...prev.primary_diagnosis,
                                    stage: e.target.value,
                                  },
                                }
                                : prev
                            )
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
                            setPatient((prev) =>
                              prev
                                ? {
                                  ...prev,
                                  primary_diagnosis: {
                                    ...prev.primary_diagnosis,
                                    sub_category: e.target.value,
                                  },
                                }
                                : prev
                            )
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
                            setPatient((prev) =>
                              prev
                                ? {
                                  ...prev,
                                  primary_diagnosis: {
                                    ...prev.primary_diagnosis,
                                    date_assessed: e.target.value,
                                  },
                                }
                                : prev
                            )
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
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    primary_diagnosis: {
                                      ...prev.primary_diagnosis,
                                      findings: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Suspicious Lumps</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.suspicious_lumps}
                            placeholder="Enter details about suspicious lumps"
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    primary_diagnosis: {
                                      ...prev.primary_diagnosis,
                                      suspicious_lumps: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pain Assessment</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.pain_assessment}
                            placeholder="Enter pain assessment details"
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    primary_diagnosis: {
                                      ...prev.primary_diagnosis,
                                      pain_assessment: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
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
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    primary_diagnosis: {
                                      ...prev.primary_diagnosis,
                                      consulting_doctor: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            className="w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            defaultValue={patient.primary_diagnosis.notes}
                            onChange={(e) =>
                              setPatient((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    primary_diagnosis: {
                                      ...prev.primary_diagnosis,
                                      notes: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                            placeholder="Enter physician notes"
                            className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full border-t border-gray-300 mt-4"></div>


                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
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
                      <button
                        onClick={addBloodTest}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
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
                      <button
                        onClick={addImagingStudy}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
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
                      <button
                        onClick={addInvestigation}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
                    </div>

                    <div className="w-full border-t border-gray-300 mt-4"></div>


                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
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
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => {
                            const today = new Date().toISOString().split('T')[0];

                            // Create new empty vitals entry
                            const newVitalsEntry = {
                              weight: 0,
                              height: 0,
                              blood_pressure: "",
                              pulse: 0,
                              temperature: 0,
                              general_observations: [""],
                              special_notes: ""
                            };

                            // Update patient object immediately
                            setPatient(prevPatient => ({
                              ...prevPatient,
                              vitals: {
                                ...prevPatient.vitals,
                                [today]: newVitalsEntry
                              }
                            }));

                            // Update local state
                            setSelectedDate(today);
                            setVitalsForm({
                              weight: "",
                              height: "",
                              blood_pressure: "",
                              pulse: "",
                              temperature: ""
                            });
                            setGeneralInspection([""]);
                            setSpecialNotes("");
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <PlusCircle size={16} />
                          <span>New Entry</span>
                        </button>

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
                              onChange={(e) => handleVitalsChange('blood_pressure', e.target.value)}
                              value={vitals.blood_pressure || ""}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                            <input
                              type="text"
                              placeholder="e.g., 72 bpm"
                              onChange={(e) => handleVitalsChange('pulse', e.target.value)}
                              value={vitals.pulse?.toString() || ""}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                            <input
                              type="text"
                              placeholder="e.g., 98.6°F"
                              onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                              value={vitals.temperature?.toString() || ""}
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
                            onChange={(e) => handleVitalsChange('weight', e.target.value)}
                            value={vitals.weight?.toString() || ""}
                            className="w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                          <input
                            type="text"
                            placeholder="e.g., 120/80"
                            onChange={(e) => handleVitalsChange('height', e.target.value)}
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

                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
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

                  {/* Paginated Medications List */}
                  <div className="space-y-4">
                    {medications
                      .slice((medicationsPage - 1) * 5, medicationsPage * 5)
                      .map((medication, index) => {
                        const actualIndex = (medicationsPage - 1) * 5 + index;
                        return (
                          <div key={actualIndex} className="p-4 border border-gray-300 rounded-md space-y-2">
                            <input
                              type="text"
                              placeholder="E.g., Paracetamol"
                              value={medication.name}
                              onChange={(e) => {
                                const updated = [...medications];
                                updated[actualIndex].name = e.target.value;
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
                                updated[actualIndex].dosage = e.target.value;
                                setMedications(updated);
                              }}
                              className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="date"
                              value={medication.start_date?.slice(0, 10) || ''}
                              onChange={(e) => {
                                const updated = [...medications];
                                updated[actualIndex].start_date = e.target.value;
                                setMedications(updated);
                              }}
                              className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="date"
                              value={medication.end_date?.slice(0, 10) || ''}
                              onChange={(e) => {
                                const updated = [...medications];
                                updated[actualIndex].end_date = e.target.value;
                                setMedications(updated);
                              }}
                              className="w-full border text-gray-900 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {medications.length > 1 && (
                              <button
                                onClick={() => removeMedication(actualIndex)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors w-full text-center"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setMedicationsPage(p => Math.max(p - 1, 1))}
                      disabled={medicationsPage === 1}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {medicationsPage} of {Math.ceil(medications.length / 5)}
                    </span>
                    <button
                      onClick={() => setMedicationsPage(p =>
                        p * 5 < medications.length ? p + 1 : p
                      )}
                      disabled={medicationsPage * 5 >= medications.length}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
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

                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                    </div>
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

                  {/* Paginated Surgeries List */}
                  <div className="space-y-4">
                    {surgeriesPerformed
                      .slice((surgeriesPage - 1) * 5, surgeriesPage * 5)
                      .map((surgery, index) => {
                        const actualIndex = (surgeriesPage - 1) * 5 + index;
                        return (
                          <div key={actualIndex} className="p-4 border border-gray-300 rounded-md space-y-2">
                            <input
                              type="text"
                              placeholder="E.g., Appendectomy"
                              value={surgery.name}
                              onChange={(e) => {
                                const updated = [...surgeriesPerformed];
                                updated[actualIndex].name = e.target.value;
                                setSurgeriesPerformed(updated);
                              }}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="date"
                              value={surgery.date?.slice(0, 10) || ''}
                              onChange={(e) => {
                                const updated = [...surgeriesPerformed];
                                updated[actualIndex].date = e.target.value;
                                setSurgeriesPerformed(updated);
                              }}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <textarea
                              placeholder="Notes"
                              value={surgery.notes}
                              onChange={(e) => {
                                const updated = [...surgeriesPerformed];
                                updated[actualIndex].notes = e.target.value;
                                setSurgeriesPerformed(updated);
                              }}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            ></textarea>
                            <textarea
                              placeholder="Complications"
                              value={surgery.complication}
                              onChange={(e) => {
                                const updated = [...surgeriesPerformed];
                                updated[actualIndex].complication = e.target.value;
                                setSurgeriesPerformed(updated);
                              }}
                              className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            ></textarea>
                            {surgeriesPerformed.length > 1 && (
                              <button
                                onClick={() => removeSurgeryPerformed(actualIndex)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors w-full text-center"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setSurgeriesPage(p => Math.max(p - 1, 1))}
                      disabled={surgeriesPage === 1}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {surgeriesPage} of {Math.ceil(surgeriesPerformed.length / 5)}
                    </span>
                    <button
                      onClick={() => setSurgeriesPage(p =>
                        p * 5 < surgeriesPerformed.length ? p + 1 : p
                      )}
                      disabled={surgeriesPage * 5 >= surgeriesPerformed.length}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
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
                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                    </div>
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
                          {patientRecords
                            .slice((recordsPage - 1) * 5, recordsPage * 5)
                            .map((record, index) => {
                              const actualIndex = (recordsPage - 1) * 5 + index;
                              return (
                                <tr key={actualIndex}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="date"
                                      value={record.date ? record.date.slice(0, 10) : ''}
                                      onChange={(e) => {
                                        const newRecords = [...patientRecords];
                                        newRecords[actualIndex].date = e.target.value;
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
                                        newRecords[actualIndex].note = e.target.value;
                                        setPatientRecords(newRecords);
                                      }}
                                      className="w-full text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ></textarea>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {patientRecords.length > 1 && (
                                      <button
                                        onClick={() => removePatientRecord(actualIndex)}
                                        className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                      >
                                        <Trash size={18} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => setRecordsPage(p => Math.max(p - 1, 1))}
                        disabled={recordsPage === 1}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {recordsPage} of {Math.ceil(patientRecords.length / 5)}
                      </span>
                      <button
                        onClick={() => setRecordsPage(p =>
                          p * 5 < patientRecords.length ? p + 1 : p
                        )}
                        disabled={recordsPage * 5 >= patientRecords.length}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={addPatientRecord}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
                    </div>
                    <div className="w-full border-t border-gray-300 mt-4"></div>
                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
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
                          {complicationRecords
                            .slice((complicationsPage - 1) * 5, complicationsPage * 5)
                            .map((record, index) => {
                              const actualIndex = (complicationsPage - 1) * 5 + index;
                              return (
                                <tr key={actualIndex}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="date"
                                      value={record.date ? new Date(record.date).toISOString().split('T')[0] : ''}
                                      onChange={(e) => {
                                        const newRecords = [...complicationRecords];
                                        newRecords[actualIndex].date = e.target.value;
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
                                        newRecords[actualIndex].complication = e.target.value;
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
                                        newRecords[actualIndex].severity = e.target.value;
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
                                        onClick={() => removeComplicationRecord(actualIndex)}
                                        className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
                                      >
                                        <Trash size={18} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => setComplicationsPage(p => Math.max(p - 1, 1))}
                        disabled={complicationsPage === 1}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {complicationsPage} of {Math.ceil(complicationRecords.length / 5)}
                      </span>
                      <button
                        onClick={() => setComplicationsPage(p =>
                          p * 5 < complicationRecords.length ? p + 1 : p
                        )}
                        disabled={complicationsPage * 5 >= complicationRecords.length}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={addComplicationRecord}
                        className="flex items-center text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Add More
                      </button>
                    </div>
                    <div className="w-full border-t border-gray-300 mt-4"></div>
                    <div className="flex justify-center mt-4 w-full">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center w-full max-w-md px-4 py-2 rounded-md transition-all duration-300 ${isSaving
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-50 text-green-600 hover:bg-green-200 hover:shadow-md'
                          }`}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                          </>
                        )}
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