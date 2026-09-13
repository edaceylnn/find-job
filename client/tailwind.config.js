/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans'],
      },
      colors: {
        primary: {
          DEFAULT: '#175cd3',
          hover: '#1849a9',
          active: '#194185',
          subtle: '#eef4ff',
          'subtle-active': '#d1e0ff',
        },
        accent: {
          DEFAULT: '#0f766e',
          subtle: '#ccfbf1',
          warm: '#f59e0b',
          'warm-subtle': '#fef3c7',
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          subtle: '#fef2f2',
        },
        success: {
          DEFAULT: '#059669',
          subtle: '#ecfdf5',
        },
        warning: {
          DEFAULT: '#d97706',
          subtle: '#fffbeb',
        },
        border: {
          DEFAULT: '#f1f5f9',
          control: '#cbd5e1',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc',
        },
        textPrimary: '#0f172a',
        textSecondary: '#64748b',
      },
      borderRadius: {
        control: '9999px',
        card: '0.5rem',
        panel: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04)',
        panel: '0 16px 40px -24px rgb(15 23 42 / 0.32)',
      },
      maxWidth: {
        container: '80rem',
      },
    },
  },
  plugins: [],
}
