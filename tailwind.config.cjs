/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(slate|gray|red|rose|orange|amber|yellow|emerald|teal|blue|indigo|purple|pink)-(50|100|200|300|400|500|600|700|800|900)$/,
      variants: ['hover', 'focus', 'group-hover']
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif']
      },
      colors: {
        primary: '#2F5B57',
        secondary: '#80CBC4',
        accent: '#FFB433',
        blueAccent: '#80CBC4',
        lightBg: '#FBF8EF',
        cardBg: '#FFFEF7'
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slight': 'bounceSlight 2s infinite ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceSlight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    }
  },
  plugins: []
};
