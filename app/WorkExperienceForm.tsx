import React, { useState } from 'react';

const JOB_TITLES = [
  'CEO',
  'Founder',
  'Co-Founder',
  'Managing Director',
  'President',
  'Vice President',
  'Chief Operating Officer (COO)',
  'Chief Financial Officer (CFO)',
  'Chief Technology Officer (CTO)',
  'Chief Marketing Officer (CMO)',
  'Chief Information Officer (CIO)',
  'General Manager',
  'Operations Manager',
  'Business Development Manager',
  'Product Manager',
  'Project Manager',
  'Account Manager',
  'Sales Manager',
  'Sales Associate',
  'Account Executive',
  'Sales Director',
  'Marketing Manager',
  'Marketing Specialist',
  'Digital Marketing Manager',
  'Content Marketing Manager',
  'Growth Manager',
  'Social Media Manager',
  'Community Manager',
  'Brand Manager',
  'Customer Success Manager',
  'Customer Support Specialist',
  'Client Relations Manager',
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Web Developer',
  'Mobile App Developer',
  'UI/UX Designer',
  'Product Designer',
  'Graphic Designer',
  'Creative Director',
  'Art Director',
  'Data Analyst',
  'Data Scientist',
  'Business Analyst',
  'Financial Analyst',
  'HR Manager',
  'Talent Acquisition Specialist',
  'Recruiter',
  'Office Manager',
  'Administrative Assistant',
  'Executive Assistant',
  'Human Resources Specialist',
  'IT Manager',
  'Network Engineer',
  'System Administrator',
  'DevOps Engineer',
  'QA Engineer',
  'Test Automation Engineer',
  'Supply Chain Manager',
  'Logistics Manager',
  'Procurement Specialist',
  'Legal Counsel',
  'Attorney',
  'Paralegal',
  'Copywriter',
  'Editor',
  'Translator',
  'Teacher',
  'Professor',
  'Researcher',
  'Scientist',
  'Healthcare Administrator',
  'Nurse',
  'Doctor',
  'Pharmacist',
  'Physical Therapist',
  'Engineer',
  'Mechanical Engineer',
  'Electrical Engineer',
  'Civil Engineer',
  'Architect',
  'Consultant',
  'Strategy Consultant',
  'Management Consultant',
  'Auditor',
  'Accountant',
  'Bookkeeper',
  'Event Manager',
  'Hospitality Manager',
  'Hotel Manager',
  'Chef',
  'Restaurant Manager',
  'Real Estate Agent',
  'Property Manager',
  'Insurance Agent',
  'Entrepreneur',
  'Investor',
  'Custom',
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// 50 years, current year down
const YEARS = Array.from(
  { length: 50 },
  (_, i) => `${new Date().getFullYear() - i}`
);

export default function WorkExperienceForm({ onSubmitJobDetails }: any) {
  const [jobTitle, setJobTitle] = useState(JOB_TITLES[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [company, setCompany] = useState('');
  const [startMonth, setStartMonth] = useState(MONTHS[0]);
  const [startYear, setStartYear] = useState(YEARS[1]);
  const [currentlyWorking, setCurrentlyWorking] = useState(true);
  const [endMonth, setEndMonth] = useState(MONTHS[0]);
  const [endYear, setEndYear] = useState(YEARS[0]);
  const [description, setDescription] = useState('');

  // Show custom input if "Custom" is selected
  const showCustomTitle = jobTitle === 'Custom';
  const currentJobTitle = showCustomTitle ? customTitle : jobTitle;

  function handleSubmit(e) {
    onSubmitJobDetails();
    return;
    e.preventDefault();
    alert(
      `Job: ${currentJobTitle}\nCompany: ${company}\nStart: ${startMonth} ${startYear}\n${
        currentlyWorking ? 'Current' : `End: ${endMonth} ${endYear}`
      }\nDescription: ${description}`
    );
  }

  return (
    <div className="h-full bg-[#F1F5F8] flex flex-col justify-center items-center">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-md p-6 md:p-10 m-2">
        <h2 className="text-2xl md:text-3xl font-light text-[#212121] mb-2">
          Work Experience
        </h2>
        <p className="text-[#0B6E90] mb-6 text-[14px] md:text-lg">
          Add your recent work experience and fill in your details to get the
          best job matches, then continue to schedule your meeting.
        </p>
        <form onSubmit={handleSubmit}>
          {/* Row 1: Job Title and Company */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-[#17494D] mb-1 text-sm font-medium">
                Job Title
              </label>
              <select
                className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition font-[400] text-black"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              >
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title} className="text-black">
                    {title}
                  </option>
                ))}
              </select>
              {showCustomTitle && (
                <input
                  className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] mt-2 text-black"
                  placeholder="Enter job title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[#17494D] mb-1 text-sm font-medium">
                Company
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition text-black"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Row 2: Start Month, Start Year, Checkbox */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
            <div className="flex-1 w-full">
              <label className="block text-[#17494D] mb-1 text-sm font-medium">
                Start Month
              </label>
              <select
                className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition text-black font-[400]"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month} className="text-black">
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[#17494D] mb-1 text-sm font-medium">
                Start Year
              </label>
              <select
                className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition text-black text-black font-[400]"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {/* Custom tick button */}
            <div className="flex items-center mt-2 md:mt-7 ml-1">
              <button
                type="button"
                onClick={() => setCurrentlyWorking(!currentlyWorking)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                  ${
                    currentlyWorking
                      ? 'bg-[#158A96] border-[#158A96]'
                      : 'bg-white border-[#aaa]'
                  }
                  transition focus:outline-none mr-2`}
                aria-pressed={currentlyWorking}
              >
                {currentlyWorking && (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M4 8L7 11L11 5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span className="text-[#17494D] text-sm select-none">
                I currently work here
              </span>
            </div>
          </div>
          {/* End Month/Year if not currently working */}
          {!currentlyWorking && (
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 w-full">
                <label className="block text-[#17494D] mb-1 text-sm font-medium">
                  End Month
                </label>
                <select
                  className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition text-black"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                >
                  {MONTHS.map((month) => (
                    <option key={month} value={month} className="text-black">
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-[#17494D] mb-1 text-sm font-medium">
                  End Year
                </label>
                <select
                  className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition text-black"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year} className="text-black">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {/* Row 3: Description */}
          <div className="mb-2">
            <label className="block text-[#17494D] mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg bg-[#f2f6fa] p-3 outline-none border border-transparent focus:border-[#158A96] transition resize-none text-black"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#158A96] text-white font-semibold shadow hover:bg-[#12717a] transition"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
      {/* Footer links */}
      <div className="w-full flex justify-center items-center mt-4 text-sm">
        <a href="#" className="text-[#158A96] hover:underline">
          Privacy Notice
        </a>
        <span className="mx-2 text-[#17494D]">|</span>
        <a href="#" className="text-[#158A96] hover:underline">
          Terms of Use
        </a>
      </div>
    </div>
  );
}
