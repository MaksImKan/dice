module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#9c27b0',
          foreground: '#ffffff',
          hover: '#7b1fa2',
        },
        success: {
          DEFAULT: '#4caf50',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#f44336',
          foreground: '#ffffff',
        },
        gray: {
          DEFAULT: '#757575',
          light: '#f5f5f5',
          dark: '#424242',
        },
        background: '#ffffff',
        foreground: '#000000de',
        border: '#0000001f',
        muted: '#00000099',
      },
      boxShadow: {
        'elevation-2': '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
