/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables dark mode toggling
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Global
        body: "#F4F5F7",
        contentBg: "#F4F5F7",
        main: "#FFFFFF",

        // Theme palette
        primary: "#8231D3",
        secondary: "#5840FF",
        success: "#01B81A",
        info: "#00AAFF",
        warning: "#FA8B0C",
        danger: "#FF0F0F",
        dark: "#0A0A0A",
        purple: "#A722F6",

        // Light mode text colors
        text: {
          light: "#666d92",
          gray: "#525768",
          muted: "#8C90A4",
        },
      },
    },
  },
  plugins: [],
};
