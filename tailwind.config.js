/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 莫兰迪色系：奶油、咖啡、淡绿、淡橙
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EDE8E0',
          400: '#E5DED4',
          500: '#D9D0C4',
        },
        coffee: {
          400: '#C4A77D',
          500: '#A0826D',
          600: '#8B7355',
          700: '#6B5D4F',
          800: '#5C5346',
          900: '#4A4238',
        },
        sage: {
          300: '#B5C4A8',
          400: '#9CAF88',
          500: '#8A9B78',
        },
        peach: {
          300: '#E8C9A8',
          400: '#D4A574',
          500: '#C4935E',
        },
        stone: {
          400: '#A89F94',
          500: '#8C8378',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans CJK SC"',
          '"Noto Sans SC"',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(92, 83, 70, 0.08)',
        'card': '0 4px 20px rgba(92, 83, 70, 0.06)',
      },
    },
  },
  plugins: [],
}
