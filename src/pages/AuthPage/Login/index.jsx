import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from "@assets/logo.png";
import { FaUserAlt, FaLock, FaUserPlus } from "react-icons/fa";

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }} // Slight scaling of the entire form container on hover
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="relative"
    >
      <motion.div className="w-full max-w-md px-8 pb-8 pt-6 bg-white rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-5">
          <motion.div >
            <img src={logo} alt="Logo" className="object-contain mb-2" />
          </motion.div>

          <h2 className="text-2xl font-bold text-blue-900">
            Login your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
              placeholder="Username"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
              placeholder="Password"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:from-red-800 hover:via-red-700 hover:to-orange-700 transition-all duration-300"
            whileHover={{ scale: 1.02, brightness: 1.1 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>

          <div className="flex flex-col items-center gap-4 mt-6">
            <a
              href="#"
              className="text-yellow-900 hover:text-blue-900 text-sm transition-colors duration-300"
            >
              Forgot password?
            </a>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Don't have an account?</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Ngăn reload trang
                  onSwitchToRegister(); // Gọi hàm chuyển sang Register
                }}
                className="text-yellow-900 hover:text-blue-900 flex items-center gap-1"
              >
                <FaUserPlus className="inline" />
                Register now
              </a>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
