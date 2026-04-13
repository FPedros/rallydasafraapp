import type { Config } from "tailwindcss";

const semanticColor = (token: string) => `oklch(var(--${token}) / <alpha-value>)`;
const directColor = (token: string) => `var(--${token})`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: semanticColor("background"),
        foreground: semanticColor("foreground"),
        card: {
          DEFAULT: semanticColor("card"),
          foreground: semanticColor("card-foreground")
        },
        popover: {
          DEFAULT: semanticColor("popover"),
          foreground: semanticColor("popover-foreground")
        },
        surface: directColor("surface"),
        primary: {
          DEFAULT: semanticColor("primary"),
          foreground: semanticColor("primary-foreground")
        },
        secondary: {
          DEFAULT: semanticColor("secondary"),
          foreground: semanticColor("secondary-foreground")
        },
        muted: {
          DEFAULT: semanticColor("muted"),
          foreground: semanticColor("muted-foreground")
        },
        accent: {
          DEFAULT: semanticColor("accent"),
          foreground: semanticColor("accent-foreground")
        },
        destructive: {
          DEFAULT: semanticColor("destructive"),
          foreground: directColor("destructive-foreground")
        },
        border: directColor("border"),
        input: directColor("input"),
        ring: semanticColor("ring"),
        dark: semanticColor("foreground"),
        text: semanticColor("muted-foreground"),
        light: semanticColor("light"),
        ink: semanticColor("foreground"),
        chart: {
          1: directColor("chart-1"),
          2: directColor("chart-2"),
          3: directColor("chart-3"),
          4: directColor("chart-4"),
          5: directColor("chart-5")
        },
        sidebar: {
          DEFAULT: semanticColor("sidebar"),
          foreground: semanticColor("sidebar-foreground"),
          primary: semanticColor("sidebar-primary"),
          "primary-foreground": semanticColor("sidebar-primary-foreground"),
          accent: semanticColor("sidebar-accent"),
          "accent-foreground": semanticColor("sidebar-accent-foreground"),
          border: directColor("sidebar-border"),
          ring: semanticColor("sidebar-ring")
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 10px 28px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        "4xl": "1.5rem"
      }
    }
  },
  plugins: []
} satisfies Config;
