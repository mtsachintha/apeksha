"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
    // API call for authentication goes here
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Logo on Mobile & Desktop */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Image src="/logo_main.png" alt="Logo" width={200} height={50} />
      </div>

      {/* Login Form */}
      <div className="m-auto w-full max-w-lg sm:max-w-md bg-white p-6 sm:p-8 shadow-lg rounded-lg">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              className="mt-1 w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:max-w-md bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Link href="/request" className="text-blue-500 hover:underline">
            Request access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
