/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        success: "#10B981",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
}


