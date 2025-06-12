import React from "react";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-white py-6">
      <div className="container max-w-none px-6 md:px-12">
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
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-r hover:bg-yellow-700 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-7 border-t border-gray-700 pt-6 text-center text-sm text-gray-500 hover:text-yellow-500">
          © 2025 BloodLife. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
