import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-purple-950 text-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* info */}
        <div>
          <Link to="/" className="flex gap-3 items-center">
            <img
              src={Logo}
              alt="Blog Logo"
              className="w-12 h-12 filter opacity-90"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 text-transparent bg-clip-text">
              Purplogs
            </h1>
          </Link>
          <p className="mt-4 text-gray-300">
            Sharing insights, tutorials, and ideas on web development and tech.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            42 Tech Park, Koramangala, Bengaluru 560034
          </p>
          <p className="text-sm text-gray-400">Email: support@purplogs.com</p>
          <p className="text-sm text-gray-400">Phone: +91 98765 43210</p>
        </div>

        {/* quick links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-300">
            Quick Links
          </h3>
          <ul className="mt-2 text-sm space-y-3">
            <li className="hover:text-purple-300 transition-colors cursor-pointer">
              Home
            </li>
            <li className="hover:text-purple-300 transition-colors cursor-pointer">
              Blogs
            </li>
            <li className="hover:text-purple-300 transition-colors cursor-pointer">
              About Us
            </li>
            <li className="hover:text-purple-300 transition-colors cursor-pointer">
              FAQs
            </li>
          </ul>
        </div>

        {/* social media links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-300">
            Follow Us
          </h3>
          <div className="flex space-x-4 mt-2">
            <FaFacebook className="text-2xl hover:text-purple-300 transition-colors cursor-pointer" />
            <FaInstagram className="text-2xl hover:text-purple-300 transition-colors cursor-pointer" />
            <FaTwitterSquare className="text-2xl hover:text-purple-300 transition-colors cursor-pointer" />
            <FaPinterest className="text-2xl hover:text-purple-300 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* newsletter subscription */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-300">
            Stay in the Loop
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            Subscribe to get special offers, free giveaways, and more
          </p>
          <form action="" className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md bg-gray-800 border-purple-700 border text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* bottom section */}
      <div className="mt-12 border-t border-purple-900 pt-6 text-center text-sm max-w-7xl mx-auto">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-purple-400">Purplogs</span>. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
