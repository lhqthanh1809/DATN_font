/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./ui/*.{js,jsx,ts,tsx}", 
    "./pages/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        woodSmoke: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#151515",
        },
        mineShaft: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#2a2a2a",
        },
        white: {
          50: "#fdfdfd",
          100: "#efefef",
          200: "#dcdcdc",
          300: "#bdbdbd",
          400: "#989898",
          500: "#7c7c7c",
          600: "#656565",
          700: "#525252",
          800: "#464646",
          900: "#3d3d3d",
          950: "#292929",
        },
        doveGray: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#696969",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#262626",
        },
      },
      fontFamily: {
        BeVietnamBlack: "BeVietnamProBlack",
        BeVietnamBold: "BeVietnamProBold",
        BeVietnamRegular: "BeVietnamProRegular",
        BeVietnamSemiBold: "BeVietnamProSemiBold",
        BeVietnamMedium: "BeVietnamProMedium"
      },
      borderWidth:{
        '1' : 1,
        "1.5" : "1.5"
      },
      fontSize:{
        '12' : '12',
        '14' : '14',
        '16' : '16',
        '18' : '18',
        '20' : '20',
        '30' : ['30', '2.6rem']
      },
      spacing:{
        '14' : 14
      }
    },
  },
  plugins: [],
};
