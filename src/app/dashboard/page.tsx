"use client";

import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch, FaSync } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  fullName: string;
  position: string;
  status: 'Approved' | 'Rejected' | 'Waiting';
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        status: statusFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`/api/admin?${query}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch users:', data.message);
        if (response.status === 401 || response.status === 403) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, pagination.page, searchQuery]);

  const handleStatusChange = async (userId: string, newStatus: 'Approved' | 'Rejected' | 'Waiting') => {
    try {
      const response = await fetch('/api/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch('/api/admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        console.error('Failed to delete user:', data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-sans relative">
            <header className="flex justify-between items-center mb-6 pt-16 sm:pt-6 w-full relative">
  {/* Logo */}
  <div className="absolute left-6">
    <Image 
      src="/logo_main.png" 
      alt="Logo" 
      width={200} 
      height={50} 
      className="hover:scale-105 transition-transform duration-300"
      priority
    />
  </div>

  {/* Right side (Dropdown and Button) */}
  <div className="flex items-center gap-4 ml-auto">
    <div className="flex items-center gap-2">
      <label className="font-medium text-gray-800 whitespace-nowrap">Status:</label>
      <select 
        className="px-3 py-2 text-gray-800 "
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
      >
        <option value="All">All</option>
        <option value="Waiting">Waiting</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  </div>
</header>


      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">No users found</div>
        ) : (
          <>
            <div className="hidden text-gray-800 md:grid md:grid-cols-4 font-semibold border-b p-4">
              <div>User Name / Full Name</div>
              <div>Position</div>
              <div>Actions</div>
              <div>Status</div>
            </div>
            
            {users.map((user) => (
              <div
                key={user._id}
                className="border-b p-4 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-0"
              >
                <div className="md:col-span-1">
                  <div className="font-medium text-gray-800">{user.username}</div>
                  <div className="text-gray-600 text-sm line-clamp-1">{user.fullName}</div>
                </div>
                <div className="text-sm text-gray-700 md:col-span-1">{user.position}</div>
                <div className="flex gap-2 items-center md:col-span-1">
                  <button
                    onClick={() => handleStatusChange(user._id, 'Approved')}
                    className="bg-green-400 hover:bg-green-300 text-white px-3 py-1 rounded text-sm"
                    disabled={user.status === 'Approved'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(user._id, 'Rejected')}
                    className="bg-red-400 hover:bg-red-300 text-white px-3 py-1 rounded text-sm"
                    disabled={user.status === 'Rejected'}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete user"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
                <div className="text-sm font-medium md:col-span-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    user.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <footer className="mt-6 flex justify-center overflow-x-auto">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded text-sm ${
                    pagination.page === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
              <span className="px-2 py-1">...</span>
            )}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
              >
                {pagination.totalPages}
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}