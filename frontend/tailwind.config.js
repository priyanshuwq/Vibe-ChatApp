import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(31 41 55)", // gray-800 for light mode
          focus: "rgb(17 24 39)", // gray-900
          content: "rgb(255 255 255)",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#1f2937",
          "primary-focus": "#111827",
          "primary-content": "#ffffff",
          "secondary": "#f3f4f6",
          "accent": "#374151",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#f9fafb",
          "primary-focus": "#f3f4f6",
          "primary-content": "#111827",
          "secondary": "#374151",
          "accent": "#9ca3af",
          "neutral": "#1f2937",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#374151",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
};

