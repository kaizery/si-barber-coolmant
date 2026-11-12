/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#006860",
        "primary-container": "#00837a",
        "primary-fixed": "#8af5e8",
        "primary-fixed-dim": "#6cd8cc",
        "on-primary": "#ffffff",
        "on-primary-container": "#f3fffc",
        "on-primary-fixed": "#00201d",
        "on-primary-fixed-variant": "#00504a",
        
        "secondary": "#745b00",
        "secondary-container": "#ffd24d",
        "secondary-fixed": "#ffe08e",
        "secondary-fixed-dim": "#edc13d",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#735a00",
        "on-secondary-fixed": "#241a00",
        "on-secondary-fixed-variant": "#584400",

        "tertiary": "#00694c",
        "tertiary-container": "#008560",
        "tertiary-fixed": "#80f9c8",
        "tertiary-fixed-dim": "#62dcad",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#f5fff7",
        "on-tertiary-fixed": "#002115",
        "on-tertiary-fixed-variant": "#00513a",

        "surface": "#f9f9ff",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#cfdaf2",
        "surface-container": "#e7eeff",
        "surface-container-low": "#f0f3ff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d8e3fb",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#d8e3fb",
        "surface-tint": "#006a63",

        "on-surface": "#111c2d",
        "on-surface-variant": "#3d4947",
        "inverse-surface": "#263143",
        "inverse-on-surface": "#ecf1ff",
        "inverse-primary": "#6cd8cc",

        "outline": "#6d7a77",
        "outline-variant": "#bcc9c6",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "background": "#f9f9ff",
        "on-background": "#111c2d",
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "margin": "1rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "gutter": "1rem",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      }
    },
  },
  plugins: [],
}

