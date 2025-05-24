import React from "react";
import {
  FaIdCard,
  FaUserShield,
  FaVirusSlash,
  FaWeight,
  FaHeartbeat,
  FaVial,
  FaBirthdayCake,
  FaHistory,
  FaMicroscope,
  FaClock,
  FaUtensils,
  FaHandsHelping,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import imagebg3 from "@assets/Background_Image/image3.jpg";
import imagebg4 from "@assets/Background_Image/image4.jpg";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4",
    title: "Save Lives Through Blood Donation",
    description:
      "Your donation can save up to three lives. Join our mission today.",
  },
  {
    image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b",
    title: "Every Drop Counts",
    description: "Be a hero in someone's story. Donate blood regularly.",
  },
  {
    image: imagebg4,
    title: "A Drop of Blood – A Million Hopes",
    description:
      "Donating blood not only saves lives but also brings hope to others.",
  },
  {
    image: imagebg3,
    title: "Together We Can Make a Difference",
    description: "Join our community of life-savers.",
  },
];

const criteriaList = [
  {
    icon: <FaIdCard size={24} className="text-red-600" />,
    title: "Identification Required",
    description: "Please bring a valid ID card or passport for verification.",
  },
  {
    icon: <FaUserShield size={24} className="text-red-600" />,
    title: "Substance-Free",
    description: "No use of illegal drugs, excessive alcohol, or stimulants.",
  },
  {
    icon: <FaVirusSlash size={24} className="text-red-600" />,
    title: "Free from Infectious Risks",
    description:
      "No HIV, Hepatitis B/C, or risky blood-borne infection behaviors.",
  },
  {
    icon: <FaWeight size={24} className="text-red-600" />,
    title: "Minimum Weight",
    description:
      "You must weigh at least 45 kg (99 lbs), regardless of gender.",
  },
  {
    icon: <FaHeartbeat size={24} className="text-red-600" />,
    title: "Good Health",
    description:
      "No chronic or acute illnesses (heart, respiratory, gastric, etc.).",
  },
  {
    icon: <FaVial size={24} className="text-red-600" />,
    title: "Healthy Hemoglobin",
    description:
      "Hemoglobin level must be ≥ 120g/L (≥125g/L if donating 350ml+).",
  },
  {
    icon: <FaBirthdayCake size={24} className="text-red-600" />,
    title: "Age Requirement",
    description:
      "Donors must be between 18 and 60 years old and in good health.",
  },
  {
    icon: <FaHistory size={24} className="text-red-600" />,
    title: "Donation Interval",
    description: "At least 12 weeks must pass between two donations.",
  },
  {
    icon: <FaMicroscope size={24} className="text-red-600" />,
    title: "Negative Hepatitis B Test",
    description: "Must test negative for Hepatitis B surface antigen.",
  },
  {
    icon: <FaClock size={24} className="text-red-600" />,
    title: "Rest Before Donation",
    description:
      "Ensure you’ve had enough sleep and feel well-rested before donating.",
  },
  {
    icon: <FaUtensils size={24} className="text-red-600" />,
    title: "Light Meal Before Donation",
    description:
      "Eat a light, low-fat meal before donating blood. Avoid fasting.",
  },
  {
    icon: <FaHandsHelping size={24} className="text-red-600" />,
    title: "Voluntary Participation",
    description:
      "Donation must be completely voluntary without any coercion or compensation.",
  },
];

const tips = [
  {
    type: "Don’t",
    color: "border-yellow-400 bg-yellow-50 text-yellow-700",
    icon: <FaTimesCircle className="text-yellow-500 text-2xl" />,
    title: "Avoid Before/After Donation",
    items: [
      "Do not drink milk, alcohol, or stimulants before donating.",
      "Avoid long-distance driving, heavy lifting, or intense workouts on donation day.",
    ],
  },
  {
    type: "Do",
    color: "border-green-400 bg-green-50 text-green-700",
    icon: <FaCheckCircle className="text-green-500 text-2xl" />,
    title: "Recommended Actions",
    items: [
      "Eat a light meal and drink 300–500ml of water before donating.",
      "Apply firm pressure on the needle site for 10 minutes, keep the bandage on for 4–6 hours.",
      "Rest for 10 minutes after donating.",
      "Lie down with feet elevated if feeling dizzy or nauseated.",
      "Apply a cold compress if bruising or swelling occurs.",
    ],
  },
  {
    type: "Emergency",
    color: "border-red-400 bg-red-50 text-red-700",
    icon: <FaExclamationTriangle className="text-red-500 text-2xl" />,
    title: "In Case of Bleeding",
    items: [
      "Raise your arm above heart level.",
      "Press the cotton/bandage with your other hand.",
      "Seek help from medical staff immediately.",
    ],
  },
];

export { slides, criteriaList, tips };
