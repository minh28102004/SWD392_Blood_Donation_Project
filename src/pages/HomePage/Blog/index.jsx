import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { blogPosts } from "./blog_Data";
import { FaNewspaper } from "react-icons/fa"; // 🆕 Thêm icon

const Blog = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 0,
      delay: 0,
    });
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 pt-5">
        <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6 flex items-center justify-center gap-3">
          <FaNewspaper className="text-black dark:text-blue-300 text-2xl" />
          Latest Stories & Updates
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-white mb-4">
                  {post.excerpt}
                </p>
                <button
                  onClick={() => window.open(post.link, "_blank")}
                  className="text-white bg-gray-800 dark:bg-gray-800 dark:text-white font-semibold px-4 py-2 rounded hover:text-yellow-500 hover:bg-gray-900 dark:hover:bg-blue-900 transition"
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
