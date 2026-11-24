/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./erp_hub_admin_dashboard*.tsx"
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
        '68': '17rem',
        '76': '19rem',
        '0.2': '0.05rem',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
