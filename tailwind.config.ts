import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#050505",       // Основний фоновий (темніший за попередній)
          surface: "#0E0E11",  // Для карточок та блоків
          border: "#1C1E24",   // Тонкі розділювачі
          muted: "#8A8F9E",    // Другорядний текст
          accent: "#FFFFFF",   // Головний контрастний колір
          highlight: "#FF3333" // Червоний для акцій/знижок або стоку
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"], // або чистий розряджений Sans
      },
      aspectRatio: {
        product: "3 / 4",
      },
    },
  },
  plugins: [],
};

export default config;