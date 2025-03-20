"use client";

import React, { useState } from "react";

const DetailsPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [activeSubSection, setActiveSubSection] = useState("demographics");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Top Section - Basic Details */}
      <div className="flex items-center space-x-4 border-b pb-4 mb-4">
        <img src="/avatar.png" alt="Avatar" className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-xl font-semibold">Harker, Megan</h2>
          <p className="text-gray-600">29-12-1988 (35 y.o) | Male (Active)</p>
          <p className="text-gray-600">📍 The Sun, Mildura VIC 3500</p>
          <p className="text-gray-600">📞 0421 935 265 (Mobile)</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        {['Dashboard', 'Details', 'Clinical'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`py-2 px-4 ${activeTab === tab.toLowerCase() ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Menu Button for Mobile */}
      <button className="md:hidden bg-blue-600 text-white p-2 w-full mb-4 rounded" onClick={() => setMenuOpen(!menuOpen)}>
        ☰ Menu
      </button>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Left Sidebar - Subsections */}
        <div className={`col-span-1 border p-4 rounded bg-gray-100 ${menuOpen ? "block" : "hidden"} md:block`}>
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <button
            onClick={() => setActiveSubSection("demographics")}
            className={`block w-full text-left py-2 px-4 mb-2 ${activeSubSection === "demographics" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          >
            Demographics
          </button>
          <button
            onClick={() => setActiveSubSection("social")}
            className={`block w-full text-left py-2 px-4 ${activeSubSection === "social" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          >
            Social
          </button>
        </div>

        {/* Main Content */}
        {activeSubSection === "demographics" && (
          <div className="col-span-2 border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Demographics</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-600">Title</span>
                <select className="w-full border p-2 rounded">
                  <option>Mrs</option>
                  <option>Mr</option>
                  <option>Ms</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-600">First Name</span>
                <input type="text" value="Megan" className="w-full border p-2 rounded" readOnly />
              </label>
              <label className="block">
                <span className="text-gray-600">Last Name</span>
                <input type="text" value="Harker" className="w-full border p-2 rounded" readOnly />
              </label>
              <label className="block">
                <span className="text-gray-600">Date of Birth</span>
                <input type="date" value="1988-12-29" className="w-full border p-2 rounded" readOnly />
              </label>
              <label className="block">
                <span className="text-gray-600">Gender</span>
                <select className="w-full border p-2 rounded">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Other Section */}
        <div className="border p-4 rounded col-span-1">
          <h3 className="text-lg font-semibold mb-2">Other</h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-gray-600">Address 1</span>
              <input type="text" value="The Sun" className="w-full border p-2 rounded" readOnly />
            </label>
            <label className="block">
              <span className="text-gray-600">Address 2</span>
              <input type="text" placeholder="Enter Address 2" className="w-full border p-2 rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
