"use client";
import Link from "next/link";
import { SetStateAction, useState, useEffect } from "react";
import { FaUserMd, FaSearch, FaFilter, FaChevronDown, FaArrowRight, FaClock, FaTimes } from "react-icons/fa";

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
    blood_tests: { name: string; result: string }[];
    imaging_studies: { name: string; result: string }[];
    other_investigations: { name: string; result: string }[];
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    wardNo: "",
    location: "",
    gender: "",
    condition: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchTypeChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchType(e.target.value);
  };

  const handleSearchQueryChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchQuery(e.target.value);
  };

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

  const wardList = [
    { wardNo: "WRD0012", fullName: "Fredrik North De Silva", lastUpdated: "2 mins ago" },
    { wardNo: "WRD0013", fullName: "Alice Johnson", lastUpdated: "5 mins ago" },
    { wardNo: "WRD0014", fullName: "John Doe", lastUpdated: "10 mins ago" },
    { wardNo: "WRD0015", fullName: "Sarah Lee", lastUpdated: "15 mins ago" },
    { wardNo: "WRD0016", fullName: "Michael Brown", lastUpdated: "20 mins ago" },
    { wardNo: "WRD0017", fullName: "Emily Davis", lastUpdated: "25 mins ago" },
    { wardNo: "WRD0012", fullName: "Fredrik North De Silva", lastUpdated: "2 mins ago" },
    { wardNo: "WRD0013", fullName: "Alice Johnson", lastUpdated: "5 mins ago" },
    { wardNo: "WRD0014", fullName: "John Doe", lastUpdated: "10 mins ago" },
    { wardNo: "WRD0015", fullName: "Sarah Lee", lastUpdated: "15 mins ago" },
    { wardNo: "WRD0016", fullName: "Michael Brown", lastUpdated: "20 mins ago" },
    { wardNo: "WRD0017", fullName: "Emily Davis", lastUpdated: "25 mins ago" },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-100 to-blue-300 text-white px-6 py-4 flex justify-between items-center shadow-xl">
        <img
          src="/logo_main.png"
          alt="Logo"
          className="h-12 hover:scale-105 cursor-pointer"
        />
        <div className="flex items-center space-x-4 bg-blue-800 px-4 py-2 rounded-full">
        <FaUserMd className="text-xl" />
          <span className="text-md font-semibold">Dr. John Doe</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Filters - Static */}
        <div className="hidden md:block bg-white w-72 p-5 shadow-xl overflow-y-auto">
          <h2 className="text-l font-bold text-gray-500 flex items-center gap-3 mb-6">
            <FaFilter className="text-gray-500" />
            <span className="bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent">
              Filters
            </span>
          </h2>

          {/* Search */}
          <div className="mt-4 relative group">
            <input
              type="text"
              placeholder={`Search by ${searchType === "name" ? "Name" : "Ward No"}`}
              className="w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:shadow-md"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            <FaSearch className="absolute left-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
          </div>

          {/* Search Type Radio */}
          <div className="flex gap-4 mt-2 text-gray-600 p-2 bg-gray-50 rounded-md">
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="searchType"
                value="wardNo"
                checked={searchType === "wardNo"}
                onChange={handleSearchTypeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              Ward No
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="searchType"
                value="name"
                checked={searchType === "name"}
                onChange={handleSearchTypeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              Name
            </label>
          </div>

          {/* Dropdown Filters */}
          {["Type", "Ward No", "Location", "Gender", "Condition"].map((label) => (
            <div key={label} className="relative mt-4 group">
              <select
                className="block w-full p-3 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm appearance-none pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 group-hover:shadow-md"
                onChange={(e) => handleFilterChange(label.toLowerCase().replace(' ', ''), e.target.value)}
              >
                <option value="">Select {label}</option>
                <option value="option1">{label} Option 1</option>
                <option value="option2">{label} Option 2</option>
              </select>
              <FaChevronDown className="absolute right-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
            </div>
          ))}

          {/* Buttons */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-3 text-white rounded-md mt-6 shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
            Apply Filters
          </button>
          <button className="w-full bg-gray-300 p-3 text-gray-700 rounded-md mt-3 shadow-lg hover:bg-gray-400 transition-colors">
            Reset Filters
          </button>
        </div>

        {/* Mobile Filters Toggle */}
        <button
          className="md:hidden fixed bottom-2 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-30 flex items-center justify-center"
          onClick={() => setShowFilters(true)}
        >
          <FaFilter className="text-xl" />
        </button>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowFilters(false)}
            ></div>

            {/* Filters panel */}
            <div className="absolute left-0 top-0 h-full w-4/5 bg-white shadow-xl overflow-y-auto">
              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <FaFilter /> Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {/* Mobile Filter Content - same as desktop but adjusted for mobile */}
                <div className="mt-4 relative group">
                  <input
                    type="text"
                    placeholder={`Search by ${searchType === "name" ? "Name" : "Ward No"}`}
                    className="w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:shadow-md"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                  />
                  <FaSearch className="absolute left-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>

                {/* Search */}
                <div className="mt-4 relative group">
                  <input
                    type="text"
                    placeholder={`Search by ${searchType === "name" ? "Name" : "Ward No"}`}
                    className="w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:shadow-md"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                  />
                  <FaSearch className="absolute left-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>

                {/* Search Type Radio */}
                <div className="flex gap-4 mt-2 text-gray-600 p-2 bg-gray-50 rounded-md">
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="searchType"
                      value="wardNo"
                      checked={searchType === "wardNo"}
                      onChange={handleSearchTypeChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    Ward No
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="searchType"
                      value="name"
                      checked={searchType === "name"}
                      onChange={handleSearchTypeChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    Name
                  </label>
                </div>

                {/* Dropdown Filters */}
                {["Type", "Ward No", "Location", "Gender", "Condition"].map((label) => (
                  <div key={label} className="relative mt-4 group">
                    <select
                      className="block w-full p-3 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm appearance-none pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 group-hover:shadow-md"
                      onChange={(e) => handleFilterChange(label.toLowerCase().replace(' ', ''), e.target.value)}
                    >
                      <option value="">Select {label}</option>
                      <option value="option1">{label} Option 1</option>
                      <option value="option2">{label} Option 2</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
                  </div>
                ))}

                {/* Buttons */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-3 text-white rounded-md mt-6 shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                  Apply Filters
                </button>
                <button className="w-full bg-gray-300 p-3 text-gray-700 rounded-md mt-3 shadow-lg hover:bg-gray-400 transition-colors">
                  Reset Filters
                </button>
              </div>              
              </div>
          </div>
        )}

        {/* Cards and Pagination Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Cards */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="group relative p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300 overflow-hidden flex flex-col"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Ward No: {patient.basic_details.ward}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                        <FaClock className="mr-1" /> Last updated: {new Date().toLocaleDateString()}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {patient.basic_details.title} {patient.basic_details.first_name} {patient.basic_details.last_name}
                    </h4>

                    <div className="flex-grow space-y-2 mb-3">
                      <p className="text-xs text-gray-700">
                        Cancer Type: <span className="font-semibold">{patient.primary_diagnosis.cancer_type}</span>
                      </p>
                      <p className="text-xs text-gray-700">
                        Stage: <span className="font-semibold">{patient.primary_diagnosis.stage}</span>
                      </p>
                      <p className="text-xs text-gray-700">
                        Complications: <span className="font-semibold">
                          {patient.complications_and_risks.length > 0
                            ? patient.complications_and_risks[0].complication
                            : 'None'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-700">
                        Status: <span className={`font-semibold ${patient.status === 'Discharged'
                            ? 'text-red-600'
                            : 'text-green-600'
                          }`}>
                          {patient.status}
                        </span>
                      </p>
                      {patient.basic_details.notes && (
                        <p className="text-xs text-gray-700">
                          Notes: <span className="font-normal">{patient.basic_details.notes.substring(0, 50)}{patient.basic_details.notes.length > 50 ? '...' : ''}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                    <Link 
  href={`/details/${patient.patient_id}`}
  className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 text-sm hover:from-blue-600 hover:to-blue-500 transition-all shadow-md group-hover:shadow-lg"
>
  View Patient
  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Pagination */}
          <div className="py-4 bg-white border-t border-gray-200 sticky bottom-0 flex justify-center space-x-2">
            {[1, 2, 3, 4, "..."].map((num, index) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${num === 1
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}