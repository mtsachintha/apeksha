"use client";
import { useState } from "react";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    type: "",
    wardNo: "",
    location: "",
    gender: "",
    condition: "",
  });

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    console.log("Updated Filters:", { ...filters, [key]: value });
  };

  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };


  const wardList = [
    { wardNo: "WRD0012", fullName: "Frdrik North De Silva", lastUpdated: "2 mins ago" },
    { wardNo: "WRD0013", fullName: "Alice Johnson", lastUpdated: "5 mins ago" },
    { wardNo: "WRD0014", fullName: "John Doe", lastUpdated: "10 mins ago" },
    { wardNo: "WRD0015", fullName: "Sarah Connor", lastUpdated: "15 mins ago" },
    { wardNo: "WRD0016", fullName: "Michael Smith", lastUpdated: "20 mins ago" },
    { wardNo: "WRD0017", fullName: "Emma Williams", lastUpdated: "25 mins ago" },
    { wardNo: "WRD0018", fullName: "Liam Brown", lastUpdated: "30 mins ago" },
    { wardNo: "WRD0019", fullName: "Sophia Miller", lastUpdated: "35 mins ago" },
    { wardNo: "WRD0020", fullName: "James Wilson", lastUpdated: "40 mins ago" },
    { wardNo: "WRD0021", fullName: "Olivia Davis", lastUpdated: "45 mins ago" },
  ];  

  return (
    <div className="flex h-screen flex-col">
      {/* ✅ Header */}
      <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <img src="/logo_main.png" alt="Logo" className="h-10" />
      <div className="flex items-center space-x-4">
          <span className="text-sm">Dr. John Doe</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed md:relative md:block bg-gray-200 w-64 p-4 transition-transform ${showFilters ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <button className="md:hidden bg-gray-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowFilters(false)}>
          ⬅
          </button>

          <h2 className="text-lg font-bold text-gray-900">Filters</h2>

          <div className="relative w-full mt-4">
      {/* Radio Buttons for Search Type Selection */}
      <div className="flex-col gap-4 mb-2">
        {/* Search Input */}
      <input
        type="text"
        placeholder={`Search by ${searchType === "name" ? "Name" : "Ward No"}`}
        className="w-full p-2 bg-white text-gray-900 rounded-lg shadow-sm"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
        <label className="flex items-center gap-2 text-gray-600 mt-2">
          <input
            type="radio"
            name="searchType"
            value="wardNo"
            checked={searchType === "wardNo"}
            onChange={handleSearchTypeChange}
          />
          Ward No
        </label>
        <label className="flex items-center gap-2 text-gray-600 mb-2">
          <input
            type="radio"
            name="searchType"
            value="name"
            checked={searchType === "name"}
            onChange={handleSearchTypeChange}
          />
          Name
        </label>
    </div>
    </div>

          {/* Dropdown Filters with Change Events */}
          {[
            { label: "Type", key: "type" },
            { label: "Ward No", key: "wardNo" },
            { label: "Location", key: "location" },
            { label: "Gender", key: "gender" },
            { label: "Condition", key: "condition" },
          ].map(({ label, key }) => (
            <div key={key} className="relative w-full">
              <select
                className="block w-full p-2 mt-2 bg-white text-gray-900 rounded-lg shadow-sm appearance-none pr-10"
                value={filters[key as keyof typeof filters]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
              >
                <option value="">{label}</option>
                <option value="option1">{label} Option 1</option>
                <option value="option2">{label} Option 2</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
  <img src="/down_arrow.png" alt="Dropdown Icon" className="w-3 h-3" />
</span>
            </div>
          ))}

          <button className="block w-full bg-blue-500 p-2 text-white rounded mt-4" onClick={() => console.log("Applying Filters:", filters)}>
            Apply Filters
          </button>
          <button className="block w-full bg-gray-400 p-2 text-white rounded mt-2" onClick={() => console.log("Applying Filters:", filters)}>
            Reset
          </button>
        </div>

        {/* Main Content (with fixed pagination) */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Mobile Filter Button */}
          <button className="md:hidden bg-blue-600 text-white px-4 py-2 mb-4" onClick={() => setShowFilters(true)}>
            Open Filters ☰
          </button>

          {/* Scrollable Ward List (Fixed Pagination) */}
          <div className="bg-white p-4 rounded shadow flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {/* Sample List Items */}
            {wardList.map((ward, i) => (
          <div key={i} className="flex items-center p-3 border-b">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{ward.wardNo}</h3>
              <p className="text-md text-gray-800">{ward.fullName}</p>
            </div>
            <div className="flex-1 text-center">
              <h3 className="text-gray-500">{ward.lastUpdated}</h3>
            </div>
            <div className="flex-1 text-right">
              <button className="text-gray-900 font-bold text-lg">➝</button>
            </div>
          </div>
        ))}

          </div>

          {/* ✅ Pagination (Fixed at Bottom) */}
          <div className="py-4 bg-white shadow-md sticky bottom-0 flex justify-center space-x-2">
            {[1, 2, 3, 4, "..."].map((num, index) => (
              <button key={index} className="px-3 py-1 bg-gray-300 text-gray-900 font-bold rounded">
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
