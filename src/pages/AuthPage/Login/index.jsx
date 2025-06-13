import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@assets/logo.png";
import {
  FaUserAlt,
  FaLock,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@redux/features/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [animationState, setAnimationState] = useState("hidden");

  useEffect(() => {
    setAnimationState("visible");
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
      const resultAction = await dispatch(
        loginUser({
          userName: formData.username,
          password: formData.password,
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        if (role === "Staff") {
          navigate("/staffLayout");
        } else if (role === "Admin") {
          navigate("/adminLayout");
        } else {
          navigate("/");
        }
        toast.success("Login successful!");
      } else {
        const errorMessage =
          resultAction.payload?.message ||
          resultAction.payload ||
          "Login failed!";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleRegisterClick = () => {
    navigate("/authPage/register");
  };

  const formVariants = {
    hidden: { opacity: 0, x: -70 },
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
      animate={animationState}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="relative"
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
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-red-800 hover:via-red-700 hover:to-orange-700"
            }`}
            whileHover={!loading && { scale: 1.02, brightness: 1.1 }}
            whileTap={!loading && { scale: 0.98 }}
          >
            {loading ? "Logging in..." : "Login"}
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
                onClick={handleRegisterClick}
                className="text-yellow-900 hover:text-blue-900 text-sm transition-colors duration-300 cursor-pointer"
              >
                <FaUserPlus className="inline" /> Register now
              </a>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
