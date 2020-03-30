module.exports = {
  theme: {
      extend: {
          screens: {
              dark: {
                  raw: "(prefers-color-scheme: dark)"
              },
          },
          colors: {
              brand: "#04A292",
              dark: "#01092D",
              secondary: "#50B89B",
              triad: "#daf0ee",
              card: "#e2e1e0",
              discord: "#2C2F33",
              twitter: "#1DA1F2",
              dim: "#00000010"
          },
          borderRadius: {
              xl: "2rem",
          },
          height: {
              "screen-16": "16vh",
              "screen-33": "33vh",
              "screen-50": "50vh",
              "screen-40": "40vh",
              "screen-45": "45vh",
              "screen-75": "75vh",
              "percent-110": "110%"
          },
          zIndex: {
              "z--1": "z-index: -1;"
          },
          boxShadow: {
              "card": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
              "card-pop": "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
          }
      },
  },
};
