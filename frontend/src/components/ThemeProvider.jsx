import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 text-gray-800 dark:text-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:to-purple-950 transition-colors duration-300">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
