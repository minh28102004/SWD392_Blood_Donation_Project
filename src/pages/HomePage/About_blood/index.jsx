import React, { useEffect } from "react";
import { FaMicroscope, FaTint } from "react-icons/fa";
import { bloodTypes, bloodComponents } from "./blood_Data";
import AOS from "aos";
import "aos/dist/aos.css";

const BloodInfoPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen">
      {/* Blood Types */}
      <section className="container mx-auto pt-20 pb-8 px-4">
        <h2
          
          className="text-3xl font-semibold mb-7 text-center flex items-center justify-center gap-3 text-red-800 dark:text-rose-200"
        >
          <FaTint className="text-red-700 dark:text-rose-300 text-2xl" />
          Blood Types Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bloodTypes.map((type, index) => (
            <div
              key={type.type}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`${type.bg} ${type.border} border-l-4 rounded-xl shadow-md hover:shadow-lg p-4 hover:scale-105 transition-all duration-300 dark:shadow-md`}
            >
              <div className="dark:text-black flex items-center gap-3 mb-4">
                <div
                  className={`${type.color} w-14 h-14 rounded-full flex items-center justify-center text-white dark:text-black text-xl font-bold`}
                >
                  {type.type}
                </div>
                <h3 className="text-lg font-semibold">Type {type.type}</h3>
              </div>

              <p className="text-sm opacity-75 mb-2 dark:text-black">
                Population : {type.population}
              </p>
              <p className="text-sm opacity-75 mb-1 dark:text-black">
                {type.description}
              </p>
              {type.rarityNote && (
                <p className="text-xs italic text-gray-500 mb-1 dark:text-gray-500">
                  {type.rarityNote}
                </p>
              )}
              <div className="flex items-center gap-1 flex-wrap text-sm dark:text-black mb-2">
                <span className="font-semibold whitespace-nowrap">
                  Donates to :
                </span>
                <div className="flex gap-1 flex-wrap">
                  {(type.donatesTo || []).map((recipient) => (
                    <span
                      key={recipient}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-50 border border-gray-300"
                    >
                      {recipient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-wrap text-sm dark:text-black">
                <span className="font-semibold whitespace-nowrap">
                  Can receive from :
                </span>
                <div className="flex gap-1 flex-wrap">
                  {type.canReceiveFrom.map((donor) => (
                    <span
                      key={donor}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-50 border border-gray-300"
                    >
                      {donor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blood Components */}
      <section className="bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <h2
            data-aos="fade-down"
            className="text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-3 text-blue-800 dark:text-blue-200"
          >
            <FaMicroscope className="text-blue-700 dark:text-blue-300 text-2xl" />
            Blood Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bloodComponents.map((component, index) => (
              <div
                key={component.name}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl overflow-hidden flex dark:shadow-md hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="w-1/3 h-52 overflow-hidden">
                  <img
                    src={component.image}
                    alt={component.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {component.icon}
                      <h3 className="text-xl font-semibold">
                        {component.name}
                      </h3>
                    </div>
                    <p className="text-sm opacity-75 mb-2">
                      {component.description}
                    </p>
                    {component.usage && (
                      <p className="text-sm mb-1">
                        <strong>Usage:</strong> {component.usage}
                      </p>
                    )}
                    {component.storage && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Storage:</strong> {component.storage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BloodInfoPage;
