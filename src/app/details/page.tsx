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
      <div className="flex space-x-4 border-b mb-4 ">
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

      {activeTab === "dashboard" && (
    <div></div>
)}

{activeTab === "details" && (
  <div className="grid md:grid-cols-4 gap-6">

    {/* Left Sidebar - Subsections */}
    <div className={`col-span-1 border p-4 rounded bg-gray-100 ${menuOpen ? "block" : "hidden"} md:block`}>
      <h3 className="text-lg font-semibold mb-2 text-gray-500">Details</h3>
      <button
        onClick={() => setActiveSubSection("demographics")}
        className={`block w-full text-left py-2 px-4 mb-2 ${
          activeSubSection === "demographics" ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        Demographics
      </button>
      <button
        onClick={() => setActiveSubSection("social")}
        className={`block w-full text-left py-2 px-4 ${
          activeSubSection === "social" ? "bg-blue-500 text-white" : "bg-gray-300"
        }`}
      >
        Medical History
      </button>
    </div>

    {/* Demographics Subsection */}
    {activeSubSection === "demographics" && (
      <div className="col-span-3 border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2 text-gray-500">Demographics</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-500">Title</span>
            <select className="w-full border p-2 rounded">
              <option>Mrs</option>
              <option>Mr</option>
              <option>Ms</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-500">First Name</span>
            <input type="text" value="Megan" className="w-full border p-2 rounded" readOnly />
          </label>
          <label className="block">
            <span className="text-gray-500">Last Name</span>
            <input type="text" value="Harker" className="w-full border p-2 rounded" readOnly />
          </label>
          <label className="block">
            <span className="text-gray-500">Date of Birth</span>
            <input type="date" value="1988-12-29" className="w-full border p-2 rounded" readOnly />
          </label>
          <label className="block">
            <span className="text-gray-500">Gender</span>
            <select className="w-full border p-2 rounded">
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-500">Contact No</span>
            <input type="text" value="The Sun" className="w-full border p-2 rounded" readOnly />
          </label>
          <label className="block col-span-2">
            <span className="text-gray-500">Address 2</span>
            <textarea 
              placeholder="Enter Address 2" 
              className="w-full border p-2 rounded" 
              rows={3} 
            ></textarea>
          </label>
        </div>

        {/* Other Section (Moved into Demographics) */}
        <div className="border p-4 rounded mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-500">Notes</h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <textarea 
                placeholder="Enter Notes" 
                className="w-full border p-2 rounded mt-2" 
                rows={3}  
              ></textarea>
            </label>
          </div>
        </div>
      </div>
    )}

    {/* Social Subsection - Empty for now */}
    {activeSubSection === "social" && (
      <div className="col-span-3 border p-4 rounded">
      <h3 className="text-lg font-semibold mb-2 text-gray-500">Medical History</h3>
      <div className="grid grid-cols-2 gap-4">
        
        {/* Radio Section 1 */}
        <fieldset className="block">
          <legend className="text-gray-500 font-semibold mb-2">Smoking</legend>
          <label className="flex items-center gap-2 text-gray-500">
  <input type="radio" name="group1" value="option1" className="mr-2" />
  Non Smoker
</label>

<label className="flex items-center gap-2 text-gray-500">
<input type="radio" name="group1" value="option2" className="mr-2" />
            Ex Smoker
          </label>
          <label className="flex items-center gap-2 text-gray-500">
            <input type="radio" name="group1" value="option3" className="mr-2" />
            Smoker
          </label>
        </fieldset>
    
        {/* Radio Section 2 */}
        <fieldset className="block">
          <legend className="text-gray-500 font-semibold mb-2">Alchohol</legend>
          <label className="flex items-center gap-2 text-gray-500">
            <input type="radio" name="group2" value="oSption1" className="mr-2" />
            Non Drinker
          </label>
          <label className="flex items-center gap-2 text-gray-500">
            <input type="radio" name="group2" value="option2" className="mr-2" />
            Ex Drinker
          </label>
          <label className="flex items-center gap-2 text-gray-500">
            <input type="radio" name="group2" value="option3" className="mr-2" />
            Drinker
          </label>
        </fieldset>
      </div>
    

        {/* Other Section (Moved into Demographics) */}
        <div className="border p-4 rounded mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-500">Past Medical Conditions:</h3>
          <p className="mt-2 mb-2 text-gray-500">Chronic Illnesses</p>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <textarea 
                placeholder="Enter Notes" 
                className="w-full border p-2 rounded mt-2" 
                rows={3}  
              ></textarea>
            </label>
          </div>
          <p className="mt-2 mb-2 text-gray-500">Allergies</p>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <textarea 
                placeholder="Enter Notes" 
                className="w-full border p-2 rounded mt-2" 
                rows={3}  
              ></textarea>
            </label>
          </div>
          <p className="mt-2 mb-2 text-gray-500">Previous Surgeries</p>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <textarea 
                placeholder="Enter Notes" 
                className="w-full border p-2 rounded mt-2" 
                rows={3}  
              ></textarea>
            </label>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-500">Family Background</h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <textarea 
                placeholder="Enter Notes" 
                className="w-full border p-2 rounded mt-2" 
                rows={3}  
              ></textarea>
            </label>
          </div>
        </div>
      </div>
    )}
  </div>
)}

{activeTab === "clinical" && (
    <div></div> 
)}      
      </div>
  );
};

export default DetailsPage;
