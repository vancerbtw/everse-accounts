module.exports = {
  theme: {
      extend: {
          screens: {
              dark: {
                  raw: "(prefers-color-scheme: dark)"
              },
          },
          colors: {
            dark: "#2d2d2d",
            darker: "#1e1e1e",
            dim: "#c0c0c0",
            light: "#f1f1f2",
            danger: "#ff2104",
              brand: "#04A292",
              secondary: "#50B89B",
              triad: "#daf0ee",
              card: "#e2e1e0",
              discord: "#2C2F33",
              twitter: "#1DA1F2",
              pastelGreen: "#43b581"
          },

      maxHeight: {
        0: 0,
        32: "8rem"
      },
      maxWidth: {
        0: 0,
        32: "8rem"
      },
      margin: {
        unset: "unset"
      },
      minHeight: {
        12: "3rem"
      },
      minWidth: {
        12: "3rem"
      },
      inset: {
        20: "5rem"
      },
      borderRadius: {
        "xl": "1rem"
      },
      spacing: {
        "1/5": "20%"
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
          translate: {
            "-50": "-50%",
            "50": "50%"
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
          margin: {
            "5p": "5%"
          },
          zIndex: {
              "z--1": -1
          },
          boxShadow: {
            "tiny": "0px 0px 60px -46px rgba(0,0,0,0.65)",
              "card": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
              "card-pop": "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"
          }
      },
  }
};
