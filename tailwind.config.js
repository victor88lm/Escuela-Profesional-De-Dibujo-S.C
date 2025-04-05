/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", 
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce': 'bounce 1s ease-in-out infinite',
        'shine': 'shine 1.5s',
      },
      keyframes: {
        ping: {
          '0%': {
            transform: 'scale(1)',
            opacity: 0.8
          },
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: 0
          }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        },
        shine: {
          '100%': {
            left: '125%'
          }
        }
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}