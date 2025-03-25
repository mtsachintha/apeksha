'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LogoPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image 
        src="/logo_main.png" 
        alt="Logo" 
        width={200} 
        height={200} 
        className="mb-10"
      />
      <button
        onClick={() => router.push('/home')}
        className="px-6 py-3 text-white bg-blue-500 rounded-full shadow-md transition-all duration-300 hover:bg-blue-600 hover:scale-105"
      >
        Dashboard →
      </button>
    </div>
  );
}
