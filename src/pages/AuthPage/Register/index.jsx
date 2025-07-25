import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@assets/logo.png";
import {
  FaUserAlt,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@redux/features/authSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/Loading";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(resultAction)) {
        const { token } = resultAction.payload;
        localStorage.setItem("token", token);
        toast.success("Register successfully!");
        navigate("/authPage/login");
      } else {
        toast.error(resultAction.payload || "Register failed!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
    }
  };

  const handleLoginClick = () => {
    navigate("/authPage/login");
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
    <>
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate={hasAnimated ? "visible" : "hidden"}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <motion.div className="w-full max-w-md px-8 pb-8 pt-6 bg-white rounded-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-5">
            <motion.div>
              <img src={logo} alt="Logo" className="object-contain" />
            </motion.div>
            <p className="text-md text-red-500 italic mb-1 tracking-wide">
              - Give life, Share hope -
            </p>
            <h2 className="text-2xl font-bold text-blue-900">
              Create your account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                placeholder="Username"
                required
              />
            </div>

            <div className="relative">
              <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                placeholder="Fullname"
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                placeholder="Email"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                placeholder="Password"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:from-red-800 hover:via-red-700 hover:to-orange-700 transition-all duration-300"
              whileHover={{ scale: 1.02, brightness: 1.1 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                {loading && <LoadingSpinner size="4" color="white" inline />}
                {loading ? "Registering..." : "Register"}
              </div>
            </motion.button>

            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Already have an account?</span>
                <a
                  onClick={handleLoginClick}
                  className="text-yellow-900 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <FaUserAlt className="inline" />
                  Login now
                </a>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Register;
