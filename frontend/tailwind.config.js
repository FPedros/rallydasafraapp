export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#EEF2EE",
                surface: "#F8FAF8",
                primary: "#49733E",
                accent: "#B78A2F",
                dark: "#183022",
                text: "#5D695F",
                light: "#FFFFFF",
                ink: "#18261D"
            },
            boxShadow: {
                soft: "0 16px 38px rgba(24, 48, 34, 0.08)"
            },
            borderRadius: {
                "4xl": "2rem"
            }
        }
    },
    plugins: []
};
