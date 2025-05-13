import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import image from "@assets/image2.jpg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: (direction) => ({
      x: direction < 0 ? "50%" : "-30%", // Chỉ di chuyển một nửa màn hình
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    }),
  };

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

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 50, // Di chuyển lên một chút khi ẩn
    },
    visible: {
      opacity: 1,
      y: 0, // Đặt về vị trí ban đầu
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imgVariants = {
    hidden: {
      opacity: 0,
      scale: 1.1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };
  const backdropVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Left side content */}
      <div className="hidden lg:flex w-4/5 flex-col items-center justify-center p-12 relative z-10">
        {/* Phần nền với hiệu ứng mờ và phóng to */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial="hidden"
          animate="visible"
          variants={backdropVariants}
        />

        {/* Nội dung chính với hiệu ứng trượt lên và mờ dần */}
        <motion.div
          className="relative z-10 bg-white bg-opacity-90 rounded-xl p-8 max-w-lg text-center shadow-lg"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3 },
          }} // Thêm hiệu ứng hover cho phần nội dung
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
          <button className="mt3 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
            See More {">>"}
          </button>
        </motion.div>

        {/* Hình ảnh với hiệu ứng mờ dần và phóng to */}
        <motion.img
          src={image}
          alt="Image"
          className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-75"
          initial="hidden"
          animate="visible"
          variants={imgVariants}
        />
      </div>

      {/* Right side content (login/register) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
        {/* Phần nền chuyển động */}
        <motion.div
          className="absolute inset-0"
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
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            custom={isLogin ? 1 : -1} // Pass direction value
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isLogin ? (
              <Login key="login" onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <Register
                key="register"
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
