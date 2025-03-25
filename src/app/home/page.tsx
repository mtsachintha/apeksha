"use client";
import { SetStateAction, useState } from "react";
import { FaUserMd, FaSearch, FaFilter, FaChevronDown, FaArrowRight, FaClock } from "react-icons/fa";

export default function Home() {
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

  const wardList = [
    { wardNo: "WRD0012", fullName: "Fredrik North De Silva", lastUpdated: "2 mins ago" },
    { wardNo: "WRD0013", fullName: "Alice Johnson", lastUpdated: "5 mins ago" },
    { wardNo: "WRD0014", fullName: "John Doe", lastUpdated: "10 mins ago" },
    { wardNo: "WRD0015", fullName: "Sarah Lee", lastUpdated: "15 mins ago" },
    { wardNo: "WRD0016", fullName: "Michael Brown", lastUpdated: "20 mins ago" },
    { wardNo: "WRD0017", fullName: "Emily Davis", lastUpdated: "25 mins ago" },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
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

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed md:relative z-20 md:block bg-white w-72 p-5 shadow-xl rounded-r-2xl md:rounded-2xl transition-all duration-300 transform ${showFilters ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <button 
            className="md:hidden bg-gray-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 mb-4"
            onClick={() => setShowFilters(false)}
          >
            ⬅ Close Filters
          </button>

          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <FaFilter className="text-blue-600" /> 
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Patient Filters
            </span>
          </h2>

          {/* Search */}
          <div className="mt-4 relative group">
            <input
              type="text"
              placeholder={`Search by ${searchType === "name" ? "Name" : "Ward No"}`}
              className="w-full p-3 pl-10 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 group-hover:shadow-md"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            <FaSearch className="absolute left-3 top-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
          </div>

          {/* Search Type Radio */}
          <div className="flex gap-4 mt-4 text-gray-600 p-2 bg-gray-50 rounded-xl">
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
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
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
                className="block w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 shadow-sm appearance-none pr-10 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 group-hover:shadow-md"
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
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-3 text-white rounded-xl mt-6 shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
            Apply Filters
          </button>
          <button className="w-full bg-gray-300 p-3 text-gray-700 rounded-xl mt-3 shadow-lg hover:bg-gray-400 transition-colors">
            Reset Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Mobile Filter Button */}
          <button 
            className="md:hidden bg-blue-600 text-white px-5 py-3 mb-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 w-max"
            onClick={() => setShowFilters(true)}
          >
            <FaFilter /> Open Filters
          </button>

          {/* Scrollable Ward List */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-180px)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {wardList.map((ward, i) => (
              <div 
                key={i} 
                className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200 overflow-hidden"
              >
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
                
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {ward.wardNo}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaClock className="mr-1" /> {ward.lastUpdated}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {ward.fullName}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-500 transition-all shadow-md group-hover:shadow-lg">
                      View Patient
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="py-4 bg-white sticky bottom-0 flex justify-center space-x-2 mt-6">
            {[1, 2, 3, 4, "..."].map((num, index) => (
              <button 
                key={index} 
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                  num === 1 
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