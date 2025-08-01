import React, { useState, useEffect } from "react";
import "./theme-toggle-button.css";

const ThemeToggleButton = ({
  showLabel = false,
  variant = "default",
  start = "top-left",
  className = "",
  isDarkMode,
  onThemeChange,
}) => {
  const [isDark, setIsDark] = useState(() => {
    if (isDarkMode !== undefined) {
      return isDarkMode;
    }
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("visiora-theme");
      return savedTheme ? JSON.parse(savedTheme) : true;
    }
    return true; // Default to dark
  });

  useEffect(() => {
    if (isDarkMode !== undefined && isDarkMode !== isDark) {
      setIsDark(isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const newTheme = isDark ? "dark" : "light";
    root.setAttribute("data-theme", newTheme);

    // Also apply to document root for Tailwind dark mode
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Add transition class to body for smooth theme change
    document.body.classList.add("theme-transitioning");

    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove("theme-transitioning");
    }, 500);

    // Save to localStorage
    localStorage.setItem("visiora-theme", JSON.stringify(isDark));

    if (onThemeChange) {
      onThemeChange(isDark);
    }
  }, [isDark, onThemeChange]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      title="Toggle theme"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <span className="theme-toggle-sr">Toggle theme</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="theme-toggle__within"
        height="1em"
        width="1em"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <clipPath id="theme-toggle__within__clip">
          <path d="M0 0h32v32h-32ZM6 16A1 1 0 0026 16 1 1 0 006 16" />
        </clipPath>
        <g clipPath="url(#theme-toggle__within__clip)">
          <path d="M30.7 21.3 27.1 16l3.7-5.3c.4-.5.1-1.3-.6-1.4l-6.3-1.1-1.1-6.3c-.1-.6-.8-.9-1.4-.6L16 5l-5.4-3.7c-.5-.4-1.3-.1-1.4.6l-1 6.3-6.4 1.1c-.6.1-.9.9-.6 1.3L4.9 16l-3.7 5.3c-.4.5-.1 1.3.6 1.4l6.3 1.1 1.1 6.3c.1.6.8.9 1.4.6l5.3-3.7 5.3 3.7c.5.4 1.3.1 1.4-.6l1.1-6.3 6.3-1.1c.8-.1 1.1-.8.7-1.4zM16 25.1c-5.1 0-9.1-4.1-9.1-9.1 0-5.1 4.1-9.1 9.1-9.1s9.1 4.1 9.1 9.1c0 5.1-4 9.1-9.1 9.1z" />
        </g>
        <path
          className="theme-toggle__within__circle"
          d="M16 7.7c-4.6 0-8.2 3.7-8.2 8.2s3.6 8.4 8.2 8.4 8.2-3.7 8.2-8.2-3.6-8.4-8.2-8.4zm0 14.4c-3.4 0-6.1-2.9-6.1-6.2s2.7-6.1 6.1-6.1c3.4 0 6.1 2.9 6.1 6.2s-2.7 6.1-6.1 6.1z"
        />
        <path
          className="theme-toggle__within__inner"
          d="M16 9.5c-3.6 0-6.4 2.9-6.4 6.4s2.8 6.5 6.4 6.5 6.4-2.9 6.4-6.4-2.8-6.5-6.4-6.5z"
        />
      </svg>
    </button>
  );
};

export default ThemeToggleButton;
