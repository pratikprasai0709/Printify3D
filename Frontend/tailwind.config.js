/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#111827',   // Dark Charcoal
          secondary: '#64748b', // Slate Text
          accent: '#3b82f6',    // Brand Blue
          bg: '#F8FAFC',        // Light Gray Background
          surface: '#FFFFFF',   // Card Surface
          border: '#E2E8F0',    // Border
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
