"use client";

import React, { useState } from "react";
import { PlusCircle, Trash } from "lucide-react";

const DetailsPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [activeSubSection, setActiveSubSection] = useState("demographics");
  const [menuOpen, setMenuOpen] = useState(false);

  const [rows, setRows] = useState([{ disease: "", relationship: "" }]);

  const addRow = () => {
    setRows([...rows, { disease: "", relationship: "" }]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (      
    <div className="bg-white min-h-screen">
      {/* ✅ Header */}
      <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <img src="/logo_main.png" alt="Logo" className="h-10" />
      <div className="flex items-center space-x-4">
          <span className="text-sm">Dr. John Doe</span>
        </div>
      </header>
      {/* Top Section - Basic Details */}
      <div className="flex items-center space-x-4 border-b mb-4 p-6 ">
        <img src="/avatar.png" alt="Avatar" className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-xl font-semibold text-gray-500">Harker, Megan</h2>
          <p className="text-gray-500">29-12-1988 (35 y.o) | Male (Active)</p>
          <p className="text-gray-500">📍 The Sun, Mildura VIC 3500</p>
          <p className="text-gray-500">📞 0421 935 265 (Mobile)</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b mb-4 pl-4 mt-4">
        {['Dashboard', 'Details', 'Clinical'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`py-2 px-4 ${activeTab === tab.toLowerCase() ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-t-lg`}
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
      activeSubSection === "demographics" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
    }`}
  >
    Demographics
  </button>
  <button
    onClick={() => setActiveSubSection("social")}
    className={`block w-full text-left py-2 px-4 mb-2 ${
      activeSubSection === "social" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
    }`}
  >
    Medical History
  </button>
  <button
    onClick={() => setActiveSubSection("background")}
    className={`block w-full text-left py-2 px-4 ${
      activeSubSection === "background" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
    }`}
  >
    Family Background
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
        </div>
      </div>
    )}


{activeSubSection === "background" && (
  <div className="col-span-3 border p-4 rounded">
    <h3 className="text-lg font-semibold mb-2 text-gray-500">Past Medical Conditions:</h3>

    <div className="grid grid-cols-2 gap-4 mb-2">
        <p className="text-gray-500 font-semibold">Hereditary Disease</p>
        <p className="text-gray-500 font-semibold">Relationship</p>
      </div>

      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 items-center mb-2">
          <input
            type="text"
            placeholder="E.g., Diabetes"
            value={row.disease}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].disease = e.target.value;
              setRows(newRows);
            }}
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="E.g., Father"
              value={row.relationship}
              onChange={(e) => {
                const newRows = [...rows];
                newRows[index].relationship = e.target.value;
                setRows(newRows);
              }}
              className="w-full border p-2 rounded"
            />
            {rows.length > 1 && (
              <button onClick={() => removeRow(index)} className="text-red-500">
                <Trash size={18} />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addRow}
        className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
      >
        <PlusCircle size={20} className="mr-2" /> Add More
      </button>
    </div>
  )}
  </div>
)}



{activeTab === "clinical" && (
  <div className="grid md:grid-cols-4 gap-6">
  {/* Left Sidebar - Subsections */}
  <div className={`col-span-1 border p-4 rounded bg-gray-100 ${menuOpen ? "block" : "hidden"} md:block`}>
    <h3 className="text-lg font-semibold mb-2 text-gray-500">Details</h3>

    <button
      onClick={() => setActiveSubSection("diagnosis")}
      className={`block w-full text-left py-2 px-4 mb-2 ${
        activeSubSection === "diagnosis" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
      }`}
    >
      Primary Diagnosis
    </button>

    <button
      onClick={() => setActiveSubSection("investigations")}
      className={`block w-full text-left py-2 px-4 mb-2 ${
        activeSubSection === "investigations" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
      }`}
    >
      Investigations Ordered
    </button>

    <button
      onClick={() => setActiveSubSection("observations")}
      className={`block w-full text-left py-2 px-4 mb-2 ${
        activeSubSection === "observations" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
      }`}
    >
      Observations
    </button>

    <button
      onClick={() => setActiveSubSection("treatments")}
      className={`block w-full text-left py-2 px-4 mb-2 ${
        activeSubSection === "treatments" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
      }`}
    >
      Treatments Given
    </button>

    <button
      onClick={() => setActiveSubSection("postTreatment")}
      className={`block w-full text-left py-2 px-4 mb-2 ${
        activeSubSection === "postTreatment" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
      }`}
    >
      Post-treatment Conditions
    </button>

    <button
      onClick={() => setActiveSubSection("complications")}
      className={`block w-full text-left py-2 px-4 ${
        activeSubSection === "complications" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
      }`}
    >
      Complications & Risks
    </button>
  </div>

{activeSubSection === "diagnosis" && (
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
    </div>
  </div>
)}


{activeSubSection === "background" && (
<div className="col-span-3 border p-4 rounded">
<h3 className="text-lg font-semibold mb-2 text-gray-500">Past Medical Conditions:</h3>

<div className="grid grid-cols-2 gap-4 mb-2">
    <p className="text-gray-500 font-semibold">Hereditary Disease</p>
    <p className="text-gray-500 font-semibold">Relationship</p>
  </div>

  {rows.map((row, index) => (
    <div key={index} className="grid grid-cols-2 gap-4 items-center mb-2">
      <input
        type="text"
        placeholder="E.g., Diabetes"
        value={row.disease}
        onChange={(e) => {
          const newRows = [...rows];
          newRows[index].disease = e.target.value;
          setRows(newRows);
        }}
        className="w-full border p-2 rounded"
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="E.g., Father"
          value={row.relationship}
          onChange={(e) => {
            const newRows = [...rows];
            newRows[index].relationship = e.target.value;
            setRows(newRows);
          }}
          className="w-full border p-2 rounded"
        />
        {rows.length > 1 && (
          <button onClick={() => removeRow(index)} className="text-red-500">
            <Trash size={18} />
          </button>
        )}
      </div>
    </div>
  ))}

  <button
    onClick={addRow}
    className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
  >
    <PlusCircle size={20} className="mr-2" /> Add More
  </button>
</div> 
)}      
      </div>
  );
};

export default DetailsPage;
