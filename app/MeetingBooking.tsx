import React from 'react';
import { InlineWidget } from 'react-calendly';

// Dummy logo/avatar—replace src with your real image URLs if needed
const LOGO = ''; // or your real logo image src
const AVATAR = ''; // or your real avatar image src

export default function RobertHalfBooking() {

    const iframe = document.querySelector('iframe[src*="calendly.com"]');

   if (iframe) {
     const container = iframe.parentElement;
    //  container.style.backgroundColor = '#000000';
   }
  return (
    <div className="flex-1 w-full ">
      <InlineWidget
        url="https://calendly.com/maxinejensenhm/30min?back=1&month=2025-09"
        styles={{
          backgroundColor: '#F1F5F8',
          // width: 'fill',
          // zIndex: -20
        }}
        // pageSettings={
        //   {  backgroundColor: '#000000'}
        // }
        // className="h-full"
      />
    </div>
  );
  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center py-8 px-2">
      <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-[360px] flex flex-col items-center py-10 px-6 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
          {/* Logo */}
          <div className="flex items-center mb-8 w-full">
            <div className="w-12 h-12 bg-[#80161c] flex items-center justify-center rounded-md mr-3">
              <span className="text-white font-bold text-2xl">rh</span>
            </div>
            <div>
              <div className="text-[#80161c] text-xl font-bold leading-tight">
                Puma Careers<sup className="text-xs font-normal">®</sup>
              </div>
              <div className="text-xs text-[#185d68] -mt-1">
                Talent Solutions
              </div>
            </div>
          </div>
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-3 flex items-center justify-center overflow-hidden text-lg text-gray-500">
            Avatar
          </div>
          {/* Name */}
          <div className="text-[#158A96] text-base font-semibold mt-1 mb-1">
            Juliana Gilbride
          </div>
          {/* Meeting Title */}
          <div className="text-[#1b1f23] text-2xl font-bold mb-2 text-center">
            30 Minute Meeting
          </div>
          {/* Duration */}
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-[#185d68] mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[#185d68] font-medium text-base">30 min</span>
          </div>
          {/* Description */}
          <div className="text-[#475467] text-sm text-center mb-8">
            Web conferencing details provided upon confirmation.
          </div>
          {/* Footer */}
          <div className="flex justify-between w-full mt-auto pt-16 text-xs text-[#6b7280]">
            <a href="#" className="hover:underline">
              Cookie settings
            </a>
            <a href="#" className="hover:underline">
              Report abuse
            </a>
          </div>
        </div>
        <InlineWidget
          url="https://calendly.com/glebamike/30min"
          styles={{
            height: '100%',
            minHeight: '350px',
            border: 'none',
            background: '#fff',
          }}
          pageSettings={{
            hideLandingPageDetails: true,
            hideEventTypeDetails: false,
            hideGdprBanner: true,
          }}
        />
        {/* Right Panel (Calendly) */}
        <div className="flex-1 flex flex-col  min-h-[600px] bg-white relative">
          {/* <div className="flex justify-between items-center mb-3">
            <div className="text-[#17494D] text-lg font-semibold">
              Select a Date & Time
            </div>
            <div className="hidden md:block">
              <div className="bg-[#313b4f] text-white text-xs px-3 py-1 rounded-br-2xl rounded-tl-xl font-semibold">
                Powered by Calendly
              </div>
            </div>
          </div> */}
          {/* Calendly Inline Widget */}
          {/* <div className="flex-1 w-full min-h-[450px] rounded-lg overflow-hidden"> */}

          {/* </div> */}
          {/* Mobile powered-by badge */}
          {/* <div className="block md:hidden text-xs text-[#6b7280] mt-2 text-center">
            <div className="bg-[#313b4f] text-white text-xs px-3 py-1 rounded-br-2xl rounded-tl-xl font-semibold inline-block">
              Powered by Calendly
            </div>
          </div> */}
          {/* Time zone and Troubleshoot */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
            <div className="flex items-center mb-2 md:mb-0">
              {/* <svg
                className="w-4 h-4 mr-2 text-[#158A96]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 6v6l4 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[#17494D] text-sm">
                Central European Time (07:34)
              </span> */}
            </div>
            <button className="flex items-center border border-[#158A96] text-[#158A96] rounded-lg px-4 py-2 hover:bg-[#e7f3f4] transition text-sm font-medium ml-0 md:ml-4">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 8v4h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Troubleshoot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
