import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";

const faqData = [
  {
    question: "Who can donate blood?",
    answer: `
      - Individuals aged 18–60, in good health, and voluntarily donating to help patients.
      - Minimum weight: 45kg. Maximum donation: 9ml/kg or 500ml per session.
      - Must not have or be at risk of transmitting HIV or other blood-borne diseases.
      - At least 12 weeks between donations.
      - Must present valid identification.
    `,
  },
  {
    question: "Who should not donate blood?",
    answer: `
      - Those with HIV, Hepatitis B/C, or behaviors that risk blood-borne infections.
      - People with chronic conditions such as heart disease, high blood pressure, or respiratory issues.
    `,
  },
  {
    question: "What tests will my blood undergo?",
    answer: `
      - Your blood will be tested for ABO and Rh blood types, HIV, Hepatitis B, Hepatitis C, syphilis, and malaria.
      - Results are confidential; free consultation is provided if any issue is detected.
    `,
  },
  {
    question: "What are the components and functions of blood?",
    answer: `
      - Red blood cells: carry oxygen.
      - White blood cells: fight infections.
      - Platelets: help with clotting.
      - Plasma: carries nutrients, antibodies, and clotting factors.
    `,
  },
  {
    question: "Why do so many people need blood transfusions?",
    answer: `
      - For injuries, accidents, bleeding, surgeries, or anemia-related conditions.
      - For cancer patients, organ transplants, and treatments requiring large blood volumes.
    `,
  },
  {
    question: "What is the blood demand in our country?",
    answer: `
      - About 1.8 million units are needed annually.
      - Only around 54% of the demand is currently met.
    `,
  },
  {
    question: "Why is an ID card required when donating blood?",
    answer: `
      - Donor information must be accurately recorded for safety and traceability.
    `,
  },
  {
    question: "Is blood donation harmful to health?",
    answer: `
      - No. If done correctly, it’s safe and does not affect health.
      - Blood regenerates naturally. Studies show no long-term adverse effects.
    `,
  },
  {
    question: "What benefits do voluntary blood donors receive?",
    answer: `
      - Free health checks and test results (HIV, Hepatitis B/C, etc.).
      - Refreshments, travel allowance, and gifts based on donation volume.
      - Certificate allowing blood reimbursement up to the donated amount.
    `,
  },
  {
    question: "Can I get a disease from donating blood?",
    answer: `
      - No. Single-use, sterile needles are used for every donation.
    `,
  },
  {
    question: "How should I prepare before donating blood?",
    answer: `
      - Sleep well the night before.
      - Eat light meals, avoid alcohol.
      - Bring ID and previous donation card (if any).
    `,
  },
  {
    question: "When should I postpone donating blood?",
    answer: `
      - 12 months: after major surgery, certain diseases, childbirth, or receiving blood.
      - 6 months: after tattoos, piercings, or recovery from serious infections.
      - 4 weeks: after common illnesses or specific vaccines.
      - 7 days: after colds, flu, or minor vaccines.
    `,
  },
  {
    question: "Can certain professions donate blood?",
    answer: `
      - Yes, but only on days off or after 12 hours rest if jobs involve high-risk activities: drivers, pilots, athletes, construction workers, etc.
    `,
  },
  {
    question: "What if I recall a risk after donating?",
    answer: `
      - Contact the blood center immediately if you remember risky behaviors or test positive for COVID-19 after donating.
    `,
  },
  {
    question: "What if I feel unwell after donating?",
    answer: `
      - Contact the donation center right away if you feel dizzy, weak, or nauseous.
    `,
  },
  {
    question: "What if the needle site is swollen?",
    answer: `
      - Apply a cold compress. If swelling doesn’t improve in 24 hours, contact the center.
    `,
  },
  {
    question: "How often can I donate blood?",
    answer: `
      - Every 12 weeks (about 3–4 times per year), if healthy.
    `,
  },
  {
    question: "Can I donate if I’m on medication?",
    answer: `
      - It depends on the medication. Inform staff beforehand for proper assessment.
    `,
  },
  {
    question: "Can vegetarians or underweight individuals donate?",
    answer: `
      - Vegetarians can donate if healthy. Underweight individuals (<45kg) should not donate.
    `,
  },
  {
    question: "Can women donate blood during menstruation or pregnancy?",
    answer: `
      - No. Women should wait until after their period ends and avoid donating during pregnancy or breastfeeding.
    `,
  },
];

const FAQs = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 pb-6 pt-20 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        {/* Tiêu đề */}
        <div className="text-center w-full">
          <h2 className="text-3xl font-bold text-red-800 mb-2">
            Blood Donation FAQs
          </h2>
          <p className="text-gray-600">
            Everything you need to know about blood donation
          </p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative w-full max-w-md ml-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-4 transition-all duration-300">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-gray-500">No questions found.</p>
        ) : (
          filteredFaqs.map((item, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div
                key={index}
                className="border border-red-300 shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex justify-between items-center w-full px-6 py-2 text-left bg-red-50 hover:bg-red-100 transition-colors duration-300"
                >
                  <span className="text-md font-semibold text-gray-800">
                    {index + 1}. {item.question}
                  </span>
                  <span className="text-2xl text-red-600 transition-transform duration-300 transform">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                <div
                  className={`px-6 text-gray-700 bg-white border-t border-red-200 text-base overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "max-h-[1000px] py-3 opacity-100"
                      : "max-h-0 py-0 opacity-0"
                  }`}
                >
                  <p className="font-medium whitespace-pre-line">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item.answer.trim(),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FAQs;
