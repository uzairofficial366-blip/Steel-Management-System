/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        card: "var(--bg-card)",
        accent: "var(--accent)",
        accentHover: "var(--accent-hover)",
        textPrimary: "var(--text-primary)",
        textMuted: "var(--text-muted)",
        borderColor: "var(--border)",
        success: "var(--success)",
        danger: "var(--danger)",
        warning: "var(--warning)",
      },
    },
  },
  plugins: [],
};
