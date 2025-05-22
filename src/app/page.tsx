'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/user', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Logout failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-8 space-y-6">
      <Image
        src="/logo_main.png"
        alt="Logo"
        width={200}
        height={200}
        className="mb-6"
      />

      {!user ? (
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 text-white bg-orange-500 rounded-full shadow-md transition-all duration-300 hover:bg-orange-600 hover:scale-105"
        >
          Login or Sign Up
        </button>
      ) : (
        <div className="border-2 border-orange-400 bg-white p-6 rounded-xl shadow-md text-center space-y-2 w-72">
          <p className="text-lg font-semibold text-gray-800">User Name: {user.username}</p>
<p className="text-sm text-gray-600">
  Position: {user.position === "9h;08NGKbR?0" ? "Admin" : user.position}
</p>          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 text-white bg-red-500 rounded-full shadow transition-all duration-300 hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      )}

      <button
  onClick={() => user && router.push('/home')}
  disabled={!user}
  className={`px-6 py-3 rounded-full shadow-md transition-all duration-300 ${
    user
      ? "text-white bg-blue-500 hover:bg-blue-600 hover:scale-105"
      : "text-gray-400 bg-gray-200 line-through cursor-not-allowed"
  }`}
>
  Endoscopy Unit Record System
</button>

<button
  onClick={() => user && router.push('/dashboard')}
  disabled={!user}
  className={`px-6 py-3 rounded-full shadow-md transition-all duration-300 ${
    user
      ? "text-white bg-green-500 hover:bg-green-600 hover:scale-105"
      : "text-gray-400 bg-gray-200 line-through cursor-not-allowed"
  }`}
>
  Admin Dashboard
</button>

      <button
        onClick={() => router.push('/home')}
        className="px-6 py-3 text-white bg-blue-800 rounded-full shadow-md transition-all duration-300 hover:bg-blue-900 hover:scale-105"
      >
        Contact Us
      </button>
    </div>

  );
}