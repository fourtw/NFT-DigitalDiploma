/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: {
          900: '#030617',
          800: '#050922',
          700: '#0b1238',
        },
        neon: {
          blue: '#5be0ff',
          cyan: '#7af6ff',
          purple: '#a07bff',
        },
        glass: 'rgba(15,25,50,0.65)',
      },
      boxShadow: {
        neon: '0 0 25px rgba(91,224,255,0.35)',
        'neon-soft': '0 0 45px rgba(112,126,244,0.35)',
        card: '0 20px 50px rgba(0,0,0,0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        card: '28px',
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}

