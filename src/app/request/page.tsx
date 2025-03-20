"use client";

import { useState } from "react";
import Image from "next/image";

const RequestAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    username: "",
    password: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Account Request Sent:", formData);
    // API call goes here
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Logo on Mobile & Desktop */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Image src="/logo_main.png" alt="Logo" width={200} height={50} />
      </div>

      {/* Mobile-Optimized Form */}
      <div className="m-auto w-full max-w-lg sm:max-w-md bg-white p-6 sm:p-8 shadow-lg rounded-lg">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center">
          Request an Account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">Position at Hospital</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Your role (e.g., Doctor, Nurse)"
              className="mt-1 w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="mt-1 w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              className="mt-1 w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium">Notes for Admin</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Provide any additional details (optional)"
              className="mt-1 w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:max-w-md bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestAccount;
