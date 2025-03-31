"use client";

import React, { useState } from "react";
import { PlusCircle, Trash, Save, Check } from "lucide-react";
import { FaUserMd, FaChevronDown, FaArrowRight, FaCalendarAlt, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

const DetailsPage = () => {
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      {/* ✅ Header */}
      <header className="bg-gradient-to-r from-gray-800 to-blue-400 text-white px-6 py-4 flex justify-between items-center shadow-xl">
        <img
          src="/logo_main.png"
          alt="Logo"
          className="h-12 transition-all hover:scale-105 hover:rotate-2 duration-300"
        />
        <div className="flex items-center space-x-4 bg-blue-900/30 px-4 py-2 rounded-full">
          <FaUserMd className="text-xl" />
          <span className="text-md font-semibold">Dr. John Doe</span>
        </div>
      </header>

      {/* Patient Profile */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-6 flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
            <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Harker, Megan</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                29-12-1988 (35 y.o) | Male (Active)
              </span>
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                The Sun, Mildura VIC 3500
              </span>
              <span className="flex items-center">
                <FaPhone className="mr-2 text-blue-500" />
                0421 935 265 (Mobile)
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
                className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors duration-200 ${
                  activeTab === tab.toLowerCase()
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
                <p><strong>Name:</strong> Lola Greenwood</p>
                <p><strong>Patient ID:</strong> PID009384</p>
                <p><strong>Blood Group:</strong> A+</p>
                <p><strong>Phone:</strong> (808) 555-0111</p>
                <p><strong>Email:</strong> nvt.isst.nute@gmail.com</p>
              </div>

              {/* Last Vitals */}
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Last Vitals</h2>
                <p><strong>Weight:</strong> 77 kg</p>
                <p><strong>Height:</strong> 170 cm</p>
                <p><strong>Blood Pressure:</strong> 120/70</p>
                <p><strong>Pulse:</strong> 60</p>
              </div>

              {/* Major Problems */}
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Primary Diagnosis</h2>
                <p><strong>Gastritis:</strong> 2021-05-15</p>
                <p><strong>Angina:</strong> 2021-05-10</p>
                <p><strong>Headaches:</strong> 2021-03-10</p>
              </div>
            </div>

            {/* Lab Results & Chronic Medication */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Lab Results</h2>
                <p><strong>WBC:</strong> 72 K/pl (5.7-16.10)</p>
                <p><strong>NEU:</strong> 24.45 K/pl (3-11.5)</p>
                <p><strong>LYM:</strong> 6 K/pl (5.7-16.7)</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-gray-500">
                <h2 className="font-semibold text-gray-700">Chronic Medication</h2>
                <p><strong>Aspirin:</strong> 2021-05-15</p>
                <p><strong>Nuorfen:</strong> 2021-05-10</p>
                <p><strong>Paracetamol:</strong> 2021-03-10</p>
              </div>
            </div>

            {/* Last Visit */}
            <div className="bg-white p-4 rounded-lg shadow mt-4 text-gray-500">
              <h2 className="font-semibold text-gray-700">Last Observation</h2>
              <p><strong>Reason:</strong> Candidiasis can be a pesky infection</p>
              <p><strong>Diagnosis:</strong> Antifungals may cause side effects</p>
              <p><strong>Medication:</strong> Paracetamol Strength, 10% Coverage</p>
              <p><strong>Other:</strong> Vecectomy Sergary</p>
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
                          <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Mrs</option>
                            <option>Mr</option>
                            <option>Ms</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value="Megan"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value="1988-12-29"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value="Harker"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Male</option>
                            <option>Female</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                          <input
                            type="text"
                            value="The Sun"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        placeholder="Enter Address"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="text-l font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Notes
                      </h3>
                      <textarea
                        placeholder="Enter Notes"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            Smoking
                          </legend>
                          <div className="space-y-2">
                            {['Non Smoker', 'Ex Smoker', 'Smoker'].map(option => (
                              <label key={option} className="flex items-center space-x-3 text-gray-700">
                                <input
                                  type="radio"
                                  name="smoking"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Alcohol
                          </legend>
                          <div className="space-y-2">
                            {['Non Drinker', 'Ex Drinker', 'Drinker'].map(option => (
                              <label key={option} className="flex items-center space-x-3 text-gray-700">
                                <input
                                  type="radio"
                                  name="alcohol"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    <div className="mt-8 space-y-6">
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
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                        {/* Buttons aligned to the right */}
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

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Allergies
                        </h4>
                        <div>

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
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4">
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
                  { name: "Observations", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
                  { name: "Treatments Given", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                  { name: "Post-treatment Conditions", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
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
                        <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Breast Cancer</option>
                          <option>Lung Cancer</option>
                          <option>Prostate Cancer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Stage I</option>
                          <option>Stage II</option>
                          <option>Stage III</option>
                          <option>Stage IV</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Assessed</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                          readOnly
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
                            placeholder="Enter findings"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Suspicious Lumps</label>
                          <textarea
                            placeholder="Enter details about suspicious lumps"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pain Assessment</label>
                          <textarea
                            placeholder="Enter pain assessment details"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <textarea
                            placeholder="Enter physician notes"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
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
              )}

              {/* Investigations Ordered Section */}
              {activeSubSection === "investigationsordered" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Investigations Ordered
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          Blood Tests
                        </h4>
                        <textarea
                          placeholder="Enter blood tests ordered"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                          Imaging Studies
                        </h4>
                        <textarea
                          placeholder="Enter imaging studies ordered"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          Other Investigations
                        </h4>
                        <textarea
                          placeholder="Enter other investigations"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
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
              )}

              {/* Observations Section */}
              {activeSubSection === "observations" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-l font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Observations
                    </h3>

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
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                            <input
                              type="text"
                              placeholder="e.g., 72 bpm"
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                            <input
                              type="text"
                              placeholder="e.g., 98.6°F"
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          General Observations
                        </h4>
                        <textarea
                          placeholder="Enter general observations"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
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
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;