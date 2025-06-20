import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { slides, criteriaList, tips } from "./content_Data";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaHeartbeat, FaRegLightbulb, FaBookOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL } from "@services/api";
import { fetchBlogPosts } from "@redux/features/blogPostsSlice";
import BloodDonationModal from "@pages/Modal_Form_Registration/ModalForm";
import BlogPostDetailModal from "../Blog/blogPostDetail";

const Content = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { blogList } = useSelector((state) => state.blogPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const previewPosts = [...blogList]
    .filter((post) => post.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    // Load blog posts if not already loaded
    if (!blogList || blogList.length === 0) {
      dispatch(fetchBlogPosts({ key: "blogPage", page: 1, size: 9 }));
    }
    return () => clearInterval(timer);
  }, []);

  const handleDonateClick = () => {
    if (!user) {
      toast.info("You need to log in before donating blood.");
      navigate("/authPage/login");
    } else {
      setShowModal(true);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };
  return (
    <div className="transition-colors duration-300">
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
            <div className="absolute inset-0 bg-black dark:bg-black opacity-50 transition-colors duration-300"></div>
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

                  <button
                    onClick={handleDonateClick}
                    className="font-semibold bg-red-700 hover:bg-red-900 hover:scale-105 text-white px-8 py-3 rounded-full transition duration-300"
                  >
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

      {/*Modal Registration*/}
      {showModal && (
        <BloodDonationModal isOpen={showModal} setIsOpen={setShowModal} />
      )}

      {/* Eligibility Criteria */}
      <section
        className="bg-gray-100 dark:bg-gray-800 pb-8 pt-5 px-4 md:px-8 transition-colors duration-300"
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-2">
            <FaHeartbeat className="text-red-600 dark:text-rose-300 text-2xl" />
            Eligibility Criteria for Blood Donation
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Help save lives by ensuring you meet these health and safety
            standards.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {criteriaList.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300"
              data-aos="zoom-in"
            >
              <div className="flex items-center mb-4 space-x-3">
                <div className="bg-red-100 p-3 rounded-full">{item.icon}</div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood Donation Tips */}
      <div
        className="bg-gray-700 dark:bg-gray-800 py-10 px-4 mt-8 sm:px-8 text-gray-800 dark:text-gray-100 transition-colors duration-300"
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
              data-aos="flip-left"
              data-aos-delay={idx * 200}
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
      <section
        className="py-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 pt-5">
          <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-8 flex items-center justify-center gap-2">
            <FaBookOpen className="text-black dark:text-blue-300 text-2xl" />
            Latest Stories & Updates
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {previewPosts.map((post, index) => (
              <div
                key={post.postId}
                className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <img
                  src={`${baseURL}${post.imgPath}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.content?.slice(0, 100)}...
                  </p>
                  <button
                    onClick={() => handleOpenModal(post)}
                    className="text-white bg-gray-800 dark:bg-gray-800 font-semibold px-4 py-2 rounded hover:text-yellow-500 hover:bg-gray-900 transition"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/*Blog Post Detail*/}
          <BlogPostDetailModal
            isOpen={modalOpen}
            post={selectedPost}
            onClose={() => setModalOpen(false)}
          />

          <div className="text-center pb-2">
            <a
              href="/homepage/blog"
              className="inline-block relative text-blue-600 dark:text-white text-base font-normal transition-all duration-300 hover:text-blue-700 dark:hover:text-blue-300 group"
            >
              <span className="inline-flex items-center transition-transform duration-300 group-hover:translate-x-1">
                View more&nbsp;&gt;&gt;
              </span>
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-blue-500 dark:bg-blue-400  transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;
