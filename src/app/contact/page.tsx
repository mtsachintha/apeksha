"use client";

import Image from "next/image";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]"></div>


      {/* Contact Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden relative z-0 hover:[box-shadow:0_20px_50px_rgba(8,_112,_184,_0.3)] transition-all duration-500">
        <div className="relative z-10 p-8">
          {/* Logo at top center */}
          <div className="flex justify-center mb-6">
            <Image
              src="/susl-logo-new.png"
              alt="Logo"
              width={200}
              height={50}
              className="hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h4 className="text-xl font-bold text-gray-800">Developed By</h4>
            <p className="text-gray-500 mt-2">
              Sabaragamuwa University of Sri Lanka
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-1">Phone</h4>
                  <p className="text-gray-600 mb-3">Available during business hours</p>
                  <a
                    href="tel:+1234567890"
                    className="text-blue-600 font-medium hover:text-blue-800 text-lg"
                  >
                    +94 (77) 2529 309
                  </a>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-1">Email</h4>
                  <p className="text-gray-600 mb-3">We'll respond within 24 hours</p>
                  <a
                    href="mailto:contact@apeksha.com"
                    className="text-blue-600 font-medium hover:text-blue-800 text-lg"
                  >
                    mtscharuka@std.appsc.sab.ac.lk
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Contact Info */}
            <div className="mt-8 text-center">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Address</h4>
              <p className="text-gray-600 mb-2">Sabaragamuwa University of Sri Lanka,</p>
              <p className="text-gray-600 mb-2">P.O. Box 02, Belihuloya,</p>
            <p className="text-gray-600">70140, Sri Lanka</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;