"use client";
import Link from "next/link";
import { SetStateAction, useState, useEffect } from "react";
import { FaUserMd, FaSearch, FaFilter, FaChevronDown, FaArrowRight, FaClock, FaTimes, FaPlus } from "react-icons/fa";
import { useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Dialog } from '@headlessui/react'; // Install with: npm install @headlessui/react

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getPaginationRange = (totalItems: number, currentPage: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisiblePages = 4; // Show up to 4 pages before adding ellipsis

    if (totalPages <= maxVisiblePages + 1) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= maxVisiblePages) {
      return [...Array.from({ length: maxVisiblePages }, (_, i) => i + 1), '...', totalPages];
    }

    if (currentPage > totalPages - maxVisiblePages) {
      return [1, '...', ...Array.from({ length: maxVisiblePages }, (_, i) => totalPages - maxVisiblePages + i + 1)];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // Calculate paginated patients
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginationRange = getPaginationRange(patients.length, currentPage);

  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const filterPatients = useCallback(() => {
    if (!debouncedSearchQuery) {
      setFilteredPatients(patients);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const filtered = patients.filter(patient => {
      // Search by name
      if (searchType === "name") {
        const fullName = `${patient.basic_details.first_name} ${patient.basic_details.last_name}`.toLowerCase();
        return fullName.includes(debouncedSearchQuery.toLowerCase());
      }

      // Search by ward
      if (searchType === "wardNo") {
        return patient.basic_details.ward.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      }

      // Simulate async search (remove timeout in real implementation)
      const timer = setTimeout(() => {
        const filtered = patients.filter(patient => {
          // ... existing filter logic ...
        });

        setFilteredPatients(filtered);
        setIsSearching(false);
      }, 200);

      return () => clearTimeout(timer);

      return true;
    });

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [patients, debouncedSearchQuery, searchType]);

  // Add these helper functions
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // For React components, use this safe version:
  const HighlightText = ({ text, query }: { text: string; query: string }) => {
    if (!query) return <>{text}</>;

    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-yellow-200">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // Add this state
  const [isSearching, setIsSearching] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newPatient, setNewPatient] = useState({
    patient_id: '', // Reset this field
    first_name: '',
    last_name: '',
    gender: '',
    city: '',
    ward: '',
  });

  //Filters

  interface Filters {
    type: string;
    wardNo: string;
    location: string;
    gender: string;
    condition: string;
    status: string;
  }

  // Update your state hooks
  const [filters, setFilters] = useState<Filters>({
    type: "",
    wardNo: "",
    location: "",
    gender: "",
    condition: "",
    status: ""
  });

  const [activeFilters, setActiveFilters] = useState<Filters>({ ...filters });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const getFilterOptions = () => {
    const options = {
      wards: Array.from(new Set(patients.map(p => p.basic_details.ward))),
      genders: Array.from(new Set(patients.map(p => p.basic_details.gender))),
      statuses: Array.from(new Set(patients.map(p => p.status))),
      locations: Array.from(new Set(patients.map(p => p.basic_details.city))),
      conditions: Array.from(new Set(patients.map(p => p.primary_diagnosis.cancer_type)))
    };
    return options;
  };

  const filterOptions = getFilterOptions();

  const applyFilters = () => {
    let filtered = [...patients];

    // Apply search first
    if (debouncedSearchQuery) {
      filtered = filtered.filter(patient => {
        if (searchType === "name") {
          const fullName = `${patient.basic_details.first_name} ${patient.basic_details.last_name}`.toLowerCase();
          return fullName.includes(debouncedSearchQuery.toLowerCase());
        }
        return patient.basic_details.ward.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      });
    }


    filtered = filtered.filter(patient => (
      (!activeFilters.wardNo || patient.basic_details.ward === activeFilters.wardNo) &&
      (!activeFilters.gender || patient.basic_details.gender === activeFilters.gender) &&
      (!activeFilters.location || patient.basic_details.city === activeFilters.location) &&
      (!activeFilters.condition || patient.primary_diagnosis.cancer_type === activeFilters.condition) &&
      (!activeFilters.status || patient.status === activeFilters.status)
    )
    );

    setFilteredPatients(filtered);
    setIsFilterApplied(true);
    setCurrentPage(1);
  };

// In your page.tsx
const handleAddPatient = async () => {
  try {
    // Prepare minimal required data
    const patientData = {
      patient_id: newPatient.patient_id,
      basic_details: {
        first_name: newPatient.first_name,
        last_name: newPatient.last_name,
        gender: newPatient.gender,
        city: newPatient.city,
        ward: newPatient.ward
      }
    };

    console.log("Sending:", JSON.stringify(patientData, null, 2));

    const response = await fetch('/api/patients/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle validation errors
      if (result.validationErrors) {
        const errorMessages = result.validationErrors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join('\n');
        throw new Error(`Validation errors:\n${errorMessages}`);
      }
      throw new Error(result.error || 'Failed to add patient');
    }

    // On success
    alert(`Patient added successfully! ID: ${result.data.patient_id}`);
    
    // Refresh patient list
    const res = await fetch("/api/patients", { cache: "no-store" });
    const data = await res.json();
    setPatients(data);
    setFilteredPatients(data);
    
    // Reset form
    setNewPatient({
      patient_id: '',
      first_name: '',
      last_name: '',
      gender: '',
      city: '',
      ward: 'Ward-1'
    });
    setIsAddDialogOpen(false);

  } catch (error: any) {
    console.error('Full error:', error);
    alert(`Error: ${error.message}`);
  }
};

  //Filters End

  useEffect(() => {
    filterPatients();
  }, [filterPatients]);

  // Initialize filteredPatients when data loads
  useEffect(() => {
    if (patients.length) {
      setFilteredPatients(patients);
    }
  }, [patients]);

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

  useEffect(() => {
    // Load filters from localStorage
    const savedFilters = localStorage.getItem('patientFilters');
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      setFilters(parsed);
      setActiveFilters(parsed);
      setIsFilterApplied(true);
    }
  }, []);

  useEffect(() => {
    // Save filters to localStorage
    if (isFilterApplied) {
      localStorage.setItem('patientFilters', JSON.stringify(activeFilters));
    }
  }, [activeFilters, isFilterApplied]);


  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }


  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-100 to-blue-300 text-white px-6 py-4 flex justify-between items-center shadow-xl">
        <img
          src="/logo_main.png"
          alt="Logo"
          className="h-12 cursor-pointer"
        />
        <div className="flex items-center space-x-4">
          {/* Add Record Button */}
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center space-x-2 cursor-pointer bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors duration-200"
          >
            <FaPlus className="text-sm" />
            <span>Add a Record</span>
          </button>

          {/* Existing User Profile */}
          <div className="flex items-center space-x-2 cursor-pointer bg-blue-800 hover:bg-blue-600 px-4 py-2 rounded-full">
            <FaUserMd className="text-xl" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Filters - Static */}
        <div className="hidden md:block bg-white w-72 p-5 shadow-xl overflow-y-auto">
          <h2 className="text-l font-bold text-gray-500 flex items-center gap-3 mb-6">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-500 bg-clip-text text-transparent">
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
            {isSearching && (
              <div className="absolute right-3 top-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
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
              WardNo
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
          {[
            { key: 'wardNo', label: 'Ward No', options: filterOptions.wards },
            { key: 'gender', label: 'Gender', options: filterOptions.genders },
            { key: 'location', label: 'Location', options: filterOptions.locations },
            { key: 'condition', label: 'Condition', options: filterOptions.conditions },
            { key: 'status', label: 'Status', options: filterOptions.statuses }
          ].map((filter) => (
            <div key={filter.key} className="relative mt-4 group">
              <select
                className="block w-full p-3 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm appearance-none pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 group-hover:shadow-md"
                value={filters[filter.key as keyof Filters]}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              >
                <option value="">Select {filter.label}</option>
                {filter.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
            </div>
          ))}

          {/* Buttons */}
          <button
            onClick={() => {
              setActiveFilters({ ...filters });
              applyFilters();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-3 text-white rounded-md mt-6 shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              const resetFilters = {
                type: "",
                wardNo: "",
                location: "",
                gender: "",
                condition: "",
                status: ""
              };
              setFilters(resetFilters);
              setActiveFilters(resetFilters);
              setFilteredPatients(patients);
              setIsFilterApplied(false);
              setCurrentPage(1);
            }}
            className="w-full bg-gray-300 p-3 text-gray-700 rounded-md mt-3 shadow-lg hover:bg-gray-400 transition-colors"
          >
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
                  {isSearching && (
                    <div className="absolute right-3 top-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
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
                {[
                  { key: 'wardNo', label: 'Ward No', options: filterOptions.wards },
                  { key: 'gender', label: 'Gender', options: filterOptions.genders },
                  { key: 'location', label: 'Location', options: filterOptions.locations },
                  { key: 'condition', label: 'Condition', options: filterOptions.conditions },
                  { key: 'status', label: 'Status', options: filterOptions.statuses }
                ].map((filter) => (
                  <div key={filter.key} className="relative mt-4 group">
                    <select
                      className="block w-full p-3 bg-gray-50 text-gray-900 rounded-md border border-gray-200 shadow-sm appearance-none pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 group-hover:shadow-md"
                      value={filters[filter.key as keyof Filters]}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    >
                      <option value="">Select {filter.label}</option>
                      {filter.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
                  </div>
                ))}

                {/* Buttons */}
                // Apply Filters button
                <button
                  onClick={() => {
                    setActiveFilters({ ...filters });
                    applyFilters();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-3 text-white rounded-md mt-6 shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Apply Filters
                </button>

// Reset Filters button
                <button
                  onClick={() => {
                    const resetFilters = {
                      type: "",
                      wardNo: "",
                      location: "",
                      gender: "",
                      condition: "",
                      status: ""
                    };
                    setFilters(resetFilters);
                    setActiveFilters(resetFilters);
                    setFilteredPatients(patients);
                    setIsFilterApplied(false);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-300 p-3 text-gray-700 rounded-md mt-3 shadow-lg hover:bg-gray-400 transition-colors"
                >
                  Reset Filters
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
            <div className="mb-4 px-2 text-sm text-gray-600">
              {debouncedSearchQuery && (
                <div className="flex items-center">
                  <FaSearch className="mr-2" />
                  Showing {filteredPatients.length} patients matching "{debouncedSearchQuery}"
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilteredPatients(patients);
                    }}
                    className="ml-4 text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="group relative p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300 overflow-hidden flex flex-col"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Ward No: <HighlightText
                          text={patient.basic_details.ward}
                          query={searchType === 'wardNo' ? debouncedSearchQuery : ''}
                        />
                      </span>
                      <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                        <FaClock className="mr-1" /> Last updated: {new Date().toLocaleDateString()}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {patient.basic_details.title}{' '}
                      <HighlightText
                        text={`${patient.basic_details.first_name} ${patient.basic_details.last_name}`}
                        query={searchType === 'name' ? debouncedSearchQuery : ''}
                      />
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
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {paginationRange.map((item, index) => (
              <button
                key={index}
                onClick={() => typeof item === 'number' ? setCurrentPage(item) : null}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${item === currentPage
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${typeof item !== 'number' ? 'cursor-default' : ''}`}
                disabled={typeof item !== 'number'}
              >
                {item}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-xl text-gray-900 font-bold mb-4">Add New Patient</Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID*</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={newPatient.patient_id}
                  onChange={(e) => setNewPatient({ ...newPatient, patient_id: e.target.value })}
                  placeholder="Enter unique patient ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={newPatient.first_name}
                  onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={newPatient.last_name}
                  onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={newPatient.city}
                  onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  className="mt-1 block w-full px-3 py-2 text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ward</label>
                <select
                  className="mt-1 block w-full px-3 py-2 text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newPatient.ward}
                  onChange={(e) => setNewPatient({ ...newPatient, ward: e.target.value })}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i} value={`Ward-${i + 1}`}>Ward {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleAddPatient}
              >
                Add Patient
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}