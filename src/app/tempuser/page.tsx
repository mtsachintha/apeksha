'use client';

import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TempUserPage() {
  useEffect(() => {
    fetch('/api/auth/username', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.username) {
          toast.success(`Welcome, ${data.username}!`);
        } else {
          toast.error('Not authenticated');
        }
      })
      .catch(() => {
        toast.error('Failed to fetch username');
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">User Info Page</h1>
      <ToastContainer />
    </div>
  );
}
