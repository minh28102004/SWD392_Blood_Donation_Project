import React, { useState, useEffect, useRef } from "react";
import {
  FiHeart,
  FiLogOut,
  FiSettings,
  FiLogIn,
  FiUserPlus,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import {
  FaHandHoldingHeart,
  FaHospital,
  FaQuestionCircle,
  FaFacebook,
  FaYoutube,
  FaTiktok,
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
import imagebg2 from "@assets/image2.jpg";
import imagebg4 from "@assets/image4.jpg";
import imagepost from "@assets/image5.jpg";
import logo from "@assets/logo.png";
import { SiZalo } from "react-icons/si";
import { motion } from "framer-motion";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Hàm xử lý click vào nút để mở hoặc đóng menu
  const toggleMenu = (event) => {
    event.stopPropagation(); // Ngừng sự kiện click từ lan ra ngoài
    setIsUserMenuOpen((prevState) => !prevState);
  };

  // Hàm xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click không phải trên dropdown hoặc button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false); // Đóng menu khi click ra ngoài
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  const quickActions = [
    {
      icon: <FaHandHoldingHeart />,
      title: "Register to Donate",
      description: "Start your journey as a donor",
    },
    {
      icon: <FaHospital />,
      title: "Find Nearby Centers",
      description: "Locate donation centers",
    },
    {
      icon: <FaQuestionCircle />,
      title: "Donation FAQs",
      description: "Get your questions answered",
    },
    {
      icon: <FiHeart />,
      title: "Experience",
      description: "Sharing from blood donors",
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

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://i.pravatar.cc/300",
  };

  const userMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <MdDashboard className="mr-2 text-lg" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <FiSettings className="mr-2 text-lg" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <FiLogOut className="mr-2 text-lg text-red-600" />,
      isDanger: true,
    },
  ];

  // Trường hợp chưa đăng nhập:
  const guestMenuItems = [
    {
      label: "Đăng nhập",
      href: "/authPage/login",
      icon: <FiLogIn className="mr-2 text-lg" />,
    },
    {
      label: "Đăng ký",
      href: "/authPage/register",
      icon: <FiUserPlus className="mr-2 text-lg" />,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed w-full bg-white shadow-md z-50 transition-all duration-300 ease-in-out">
        <nav className="container mx-auto shadow-lg px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={logo} alt="BloodLife Logo" className="h-14 w-auto" />
            </div>

            {/* Navigation */}
            <div className="hidden md:flex space-x-10 text-base font-semibold">
              {["Home", "FAQs", "News", "Blog", "Orther"].map((text, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-black hover:text-blue-700 font-semibold relative group transition-all duration-300"
                >
                  {text}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Account */}
            <div className="flex items-center space-x-4 relative">
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 p-1 pr-3 bg-gray-200 hover:bg-blue-100 rounded-full shadow-sm transition duration-300"
                >
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/100?u=guest"}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-yellow-600"
                  />
                  <span className="hidden md:inline text-sm font-medium text-gray-800">
                    {user?.name || "Khách"}
                  </span>
                  <FiChevronDown className="text-gray-500" />
                </button>

                {/* Dropdown */}
                <div
                  ref={dropdownRef}
                  className={`absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-xl transform transition-all duration-300 origin-top-right z-50 ${
                    isUserMenuOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {user && (
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm text-gray-800 font-semibold">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  )}

                  <div className="py-1">
                    {(user ? guestMenuItems : guestMenuItems).map(
                      (item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className={`flex items-center px-4 py-2 text-sm ${
                            item.isDanger
                              ? "text-red-600 hover:bg-red-50"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon && item.icon}
                          {item.label}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
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
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1 */}
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-4">
                BloodLife
              </h3>
              <p className="text-gray-400">
                Community Project: Blood Donation - Connecting Life
              </p>
              <ul className="mt-4 space-y-1 text-sm text-gray-400">
                <li>📍 District 9, FPT University, Vietnam</li>
                <li>📞 Hotline: 0123 456 789</li>
                <li>✉️ Email: BloodLife@dng.com</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Get Involved
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Become a Donor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Volunteer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition">
                    Organize a Blood Drive
                  </a>
                </li>
              </ul>

              <h4 className="text-lg font-semibold text-white mt-6 mb-2">
                Working Hours
              </h4>
              <p className="text-gray-400 text-sm">
                Mon - Sat: 8:00 AM - 5:00 PM
              </p>
              <p className="text-gray-400 text-sm">Sun: Closed</p>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Stay Connected
              </h4>
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  <FaYoutube size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  <SiZalo size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded-l bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                />
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-l hover:bg-yellow-700 transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-7 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            © 2025 BloodLife. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
