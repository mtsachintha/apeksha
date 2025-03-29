"use client";

import { useEffect, useState } from "react";

interface Patient {
  _id: string;
  fullName: string;
  patientId: string;
  location: string;
  dateOfBirth: string;
  wardNo: string;
  diagnosis: string[];
  investigations: string[];
  treatments: string[];
  complications: string[];
  postObservations: string[];
}

export default function Home() {
  const [items, setItems] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/items", { 
          cache: "no-store" 
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Patient Records</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.fullName} <span className="text-blue-600">(ID: {item.patientId})</span>
                  </h2>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Location:</span> {item.location}</p>
                    <p><span className="font-medium">Date of Birth:</span> {item.dateOfBirth}</p>
                    <p><span className="font-medium">Ward No:</span> {item.wardNo}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <PatientSection title="Diagnosis" items={item.diagnosis} />
                  <PatientSection title="Investigations" items={item.investigations} />
                  <PatientSection title="Treatments" items={item.treatments} />
                  <PatientSection title="Complications" items={item.complications} />
                  <PatientSection title="Post Observations" items={item.postObservations} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PatientSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-1 pl-5">
          {items.map((item, index) => (
            <li key={index} className="text-gray-600 text-sm before:content-['•'] before:mr-2 before:text-blue-500">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm pl-5">No {title.toLowerCase()} recorded</p>
      )}
    </div>
  );
}