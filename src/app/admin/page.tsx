"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(data.message || "Invalid admin credentials");
        } else if (res.status === 400) {
          throw new Error(data.message || "Validation error");
        } else {
          throw new Error(data.message || "Login failed. Please try again.");
        }
      }

      router.push("/admin/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);

      if (process.env.NODE_ENV === "development") {
        console.error("Admin login error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Image
          src="/logo_main.png"
          alt="Logo"
          width={200}
          height={50}
          className="hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden relative z-0 hover:[box-shadow:0_20px_50px_rgba(8,_112,_184,_0.3)] transition-all duration-500">
        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-gray-500 mt-2">Sign in as administrator</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="relative z-10">Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Back to{" "}
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
