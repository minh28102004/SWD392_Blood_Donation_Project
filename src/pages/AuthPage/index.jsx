import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import image from "@assets/Background_Image/image2.jpg";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname.includes("login");
  const direction = isLogin ? 1 : -1;

  const backgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%"],
      transition: {
        duration: 30,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); 
  }, []);

  const handleToHomePage = () => {
    navigate("/homepage");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Left side content */}
      <div className="hidden lg:flex w-4/5 flex-col items-center justify-center p-12 relative z-10">
        <div
          className="absolute inset-0 bg-black opacity-50"
          data-aos="fade"
          data-aos-duration="1500"
        />
        <div
          className="relative z-10 bg-white bg-opacity-90 rounded-xl p-8 max-w-lg text-center shadow-lg"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <h2 className="text-3xl font-bold text-black mb-5">
            Donate Blood, Save Lives
          </h2>
          <p className="text-gray-700 text-lg mb-6 text-justify">
            Blood donation is one of the simplest yet most impactful ways to
            make a difference in someone's life. By donating blood, you could
            save up to three lives and help those in need during emergencies,
            surgeries, and ongoing medical treatments. Your small act can have a
            profound impact, providing hope and strength to others.
          </p>
          <button
            onClick={handleToHomePage}
            className="mt-3 px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-black hover:text-yellow-400 hover:scale-105 transition"
          >
            See More {">>"}
          </button>
        </div>
        <div
          data-aos="fade"
          data-aos-duration="2000"
          className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-75"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* Right side content (login/register) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        {/* Phần nền chuyển động */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          variants={backgroundVariants}
          animate="animate"
          style={{ zIndex: -1 }} // Đặt z-index để phần nền không che phủ form
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-red-300 opacity-20"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, 30, 0, -30, 0], // Di chuyển lên xuống
                x: [0, 15, 0, -15, 0], // Di chuyển qua lại
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md z-20"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
