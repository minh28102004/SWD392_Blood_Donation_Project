import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { blogPosts } from "@pages/HomePage/Blog/blog_Data";
import { slides, criteriaList, tips } from "./content_Data";
import AOS from "aos";
import "aos/dist/aos.css"; 
import { motion, AnimatePresence } from "framer-motion";

const Content = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const previewPosts = blogPosts.slice(0, 3);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Khởi tạo AOS
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
      <motion.div
        className="relative h-screen pt-8 mb-4"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {index === currentSlide && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center text-white px-4">
                  <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    className="text-xl md:text-2xl mb-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                  >
                    {slide.description}
                  </motion.p>

                  <button className="font-semibold bg-red-700 hover:bg-red-900 hover:scale-105 text-white px-8 py-3 rounded-full transition duration-300">
                    Donate Blood Now
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full z-30"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full z-30"
        >
          <FiChevronRight size={24} />
        </button>
      </motion.div>

      {/* Eligibility Criteria */}
      <section
        className="bg-gray-100 pb-8 pt-5 px-4 md:px-8"
        data-aos="fade-up"
      >
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
              data-aos="zoom-in" // Hiệu ứng zoom-in khi xuất hiện
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

      {/* Blood Donation Tips */}
      <div
        className="bg-gray-700 py-10 px-4 mt-8 sm:px-8 text-gray-800"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-white">
          💉 Blood Donation Tips & Precautions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tips.map((section, idx) => (
            <div
              key={idx}
              className={`border-l-4 p-6 rounded-lg shadow-md ${section.color}`}
              data-aos="flip-left" // Thêm hiệu ứng flip-left cho mỗi mục
              data-aos-delay={idx * 200} // Thêm độ trễ cho mỗi mục
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
            </div>
          ))}
        </div>

        <div className="mt-12 text-sm text-center text-white">
          — Dr. Ngô Văn Tân, Head of Blood Donation Reception, Hematology
          Hospital —
        </div>
      </div>

      {/* Blog & Stories */}
      <section className="py-6 bg-gray-50" data-aos="fade-up">
        <div className="container mx-auto px-6 pt-5">
          <h2 className="text-4xl font-bold text-center text-black mb-8">
            Latest Stories & Updates
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {previewPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
                data-aos="fade-up" // Thêm hiệu ứng fade-up cho mỗi bài viết
                data-aos-delay={index * 200} // Thêm độ trễ cho mỗi bài viết
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button
                    onClick={() => window.open(post.link, "_blank")}
                    className="text-white bg-gray-800 font-semibold px-4 py-2 rounded hover:text-yellow-500 hover:bg-gray-900 transition"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center pb-2">
            <a
              href="/homepage/blog"
              className="inline-block relative text-blue-600 text-base font-normal transition-all duration-300 hover:text-blue-700 group"
            >
              <span className="inline-flex items-center transition-transform duration-300 group-hover:translate-x-1">
                View more&nbsp;&gt;&gt;
              </span>
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-blue-900 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;
