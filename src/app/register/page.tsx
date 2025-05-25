"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    position: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.username || !formData.position) {
      setError("Please fill out all fields");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          position: formData.position,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login?registered=true");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Image src="/logo_main.png" alt="Logo" width={200} height={50} className="hover:scale-105 transition-transform duration-300" priority />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden relative z-0 hover:[box-shadow:0_20px_50px_rgba(8,_112,_184,_0.3)] transition-all duration-500">
        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">National Cancer Institute Sri Lanka</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

          <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full text-gray-900 px-4 py-3 border border-gray-200 rounded-lg" required />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full text-gray-900 px-4 py-3 border border-gray-200 rounded-lg" required minLength={3} maxLength={30} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full text-gray-900 px-4 py-3 border border-gray-200 rounded-lg" required />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full text-gray-900 px-4 py-3 border border-gray-200 rounded-lg" required minLength={8} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full text-gray-900 px-4 py-3 border border-gray-200 rounded-lg" required minLength={8} />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium py-3 px-4 rounded-lg transition-all`}
            >
              {isLoading ? "Registering..." : step === 1 ? "Next" : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
