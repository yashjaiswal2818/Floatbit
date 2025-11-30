/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C57A50',
        sidebar: '#F5EEDC',
        aoiOutline: '#E8D6A1',
        toolbarIcon: '#A08F7B',
        disabled: '#D8D8D8',
        inputBorder: '#DCCEB8',
        secondaryBorder: '#C8B69C',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'SF Pro', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
