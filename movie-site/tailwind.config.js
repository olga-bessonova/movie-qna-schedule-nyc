module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          scroll: {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
        },
        animation: {
          scroll: "scroll linear infinite",
        },
      },
    },
    plugins: [require("daisyui"),
      require('@tailwindcss/line-clamp'),
      react({ jsxRuntime: 'automatic' }),
    ],  
  }
  