'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { JSX } from 'react';

function MessageContent() {

  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const messages: Record<string, { title: JSX.Element; desc: string }> = {
    pending: {
      title: (
        <>
          Your account is still{" "}
          <span className="bg-yellow-200 px-1 rounded-sm">
            waiting for confirmation
          </span>
          .
        </>
      ),
      desc: "Please contact the administrator for further assistance.",
    },
    rejected: {
      title: (
        <>
          Your account{" "}
          <span className="bg-yellow-200 px-1 rounded-sm">
            request has been rejected
          </span>
          .
        </>
      ),
      desc: "If you believe this is a mistake, contact the administrator.",
    },
  };

  const fallbackMessage = {
    title: "Unknown status",
    desc: "Please contact support.",
  };

  const message = reason && reason in messages ? messages[reason] : fallbackMessage;

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
      <div className="z-10 bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">{message.title}</h1>
        <p className="text-gray-600">{message.desc}</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Contact Admin
        </button>
      </div>
    </div>
  );
}

export default function MessagePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessageContent />
    </Suspense>
  );
}
