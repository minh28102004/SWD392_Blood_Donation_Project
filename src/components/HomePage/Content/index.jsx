import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
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
import imagebg from "@assets/image3.jpg";
import imagebg4 from "@assets/image4.jpg";
import imagepost from "@assets/image5.jpg";
import { motion } from "framer-motion";

const Content = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
      image: imagebg,
      title: "Together We Can Make a Difference",
      description: "Join our community of life-savers.",
    },
  ];

  const blogPosts = [
    {
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
      title: "Impact of Regular Blood Donation",
      excerpt: "Discover how regular blood donation helps save lives...",
    },
    {
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      title: "Breaking Myths About Blood Donation",
      excerpt: "Learn the truth about common blood donation myths...",
    },
    {
      image: imagepost,
      title: "Stories of Hope",
      excerpt: "Read inspiring stories from blood recipients...",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return (
    <div>
      {/* Hero Slider */}
      <div className="relative h-screen pt-16 mb-6">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
                <button className="font-semibold bg-red-700 hover:bg-red-900  text-white px-8 py-3 rounded-full transition duration-300">
                  Donate Blood Now
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/*blood donation standards*/}
      <section className="bg-gray-100 pb-8 pt-5 px-4 md:px-8 ">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-black mb-4">
            Eligibility Criteria for Blood Donation
          </h2>
          <p className="text-gray-600 text-lg">
            Help save lives by ensuring you meet these health and safety
            standards.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {criteriaList.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center mb-4 space-x-3">
                <div className="bg-red-100 p-3 rounded-full">{item.icon}</div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/*Advances & Disadvantages*/}
      <div className="bg-gray-700 py-10 px-4 mt-14 sm:px-8 text-gray-800">
        <h2 className="text-3xl font-bold mb-10 text-center text-white">
          💉 Blood Donation Tips & Precautions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tips.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`border-l-4 p-6 rounded-lg shadow-md ${section.color}`}
            >
              <div className="flex items-center mb-4 gap-2">
                {section.icon}
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-sm text-center text-white">
          — Dr. Ngô Văn Tân, Head of Blood Donation Reception, Hematology
          Hospital —
        </div>
      </div>

      {/* Blog & Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Stories & Updates
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-white bg-gray-800 font-semibold hover:text-yellow-500 hover:bg-gray-900">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;
