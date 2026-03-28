/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic color tokens
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#0F172A", // Slate 950 — NO pure black
        },
        "surface-card": {
          DEFAULT: "#F8FAFC", // Slate 50
          dark: "#1E293B", // Slate 800
        },
        "surface-hover": {
          DEFAULT: "#F1F5F9", // Slate 100
          dark: "#334155", // Slate 700
        },
        "text-primary": {
          DEFAULT: "#1E293B", // Slate 800
          dark: "#E2E8F0", // Slate 200
        },
        "text-secondary": {
          DEFAULT: "#64748B", // Slate 500
          dark: "#94A3B8", // Slate 400
        },
        "text-muted": {
          DEFAULT: "#94A3B8", // Slate 400
          dark: "#64748B", // Slate 500
        },
        accent: {
          DEFAULT: "#3B82F6", // Blue 500
          dark: "#60A5FA", // Blue 400
          hover: "#2563EB", // Blue 600
          "hover-dark": "#93C5FD", // Blue 300
        },
        border: {
          DEFAULT: "#E2E8F0", // Slate 200
          dark: "#334155", // Slate 700
        },
      },
      fontFamily: {
        heading: [
          "'Plus Jakarta Sans'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        body: ["'Lora'", "Charter", "Georgia", "'Times New Roman'", "serif"],
        ui: [
          "'Inter'",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "'Cascadia Code'",
          "monospace",
        ],
      },
      fontSize: {
        // Perfect Fourth scale (1.333) from 16px base
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.3125rem", { lineHeight: "1.75rem" }], // 21px — body text
        "2xl": ["1.75rem", { lineHeight: "2.25rem" }], // 28px — H3
        "3xl": ["2.3125rem", { lineHeight: "2.75rem" }], // 37px — H2
        "4xl": ["3.125rem", { lineHeight: "3.5rem" }], // 50px — H1
      },
      spacing: {
        // 4px grid reinforcement
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
        30: "7.5rem", // 120px
      },
      maxWidth: {
        article: "45rem", // 720px — slightly roomier reading width
        wide: "80rem", // 1280px
      },
      borderRadius: {
        tag: "0.25rem", // 4px — tags
        card: "0.5rem", // 8px — cards, code blocks
        modal: "1rem", // 16px — modals
        pill: "9999px", // pills, avatars
      },
      boxShadow: {
        "card-sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "card-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        "card-hover":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.text-primary.DEFAULT"),
            "--tw-prose-headings": theme("colors.text-primary.DEFAULT"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-bold": theme("colors.text-primary.DEFAULT"),
            "--tw-prose-code": theme("colors.text-primary.DEFAULT"),
            "--tw-prose-quotes": theme("colors.text-secondary.DEFAULT"),
            "--tw-prose-quote-borders": theme("colors.accent.DEFAULT"),
            "--tw-prose-counters": theme("colors.text-secondary.DEFAULT"),
            "--tw-prose-bullets": theme("colors.text-muted.DEFAULT"),
            "--tw-prose-hr": theme("colors.border.DEFAULT"),
            "--tw-prose-th-borders": theme("colors.border.DEFAULT"),
            "--tw-prose-td-borders": theme("colors.border.DEFAULT"),

            // Body text settings
            fontFamily: theme("fontFamily.body").join(", "),
            fontSize: "1.3125rem", // 21px
            lineHeight: "1.75",
            maxWidth: "43.75rem", // 700px

            // Heading typography
            h1: {
              fontFamily: theme("fontFamily.heading").join(", "),
              fontWeight: "800",
              fontSize: theme("fontSize.4xl[0]"),
              lineHeight: theme("fontSize.4xl[1].lineHeight"),
              letterSpacing: "-0.025em",
              marginTop: "0",
              marginBottom: "1.5rem",
            },
            h2: {
              fontFamily: theme("fontFamily.heading").join(", "),
              fontWeight: "700",
              fontSize: theme("fontSize.3xl[0]"),
              lineHeight: theme("fontSize.3xl[1].lineHeight"),
              letterSpacing: "-0.02em",
              marginTop: "3rem",
              marginBottom: "1.25rem",
            },
            h3: {
              fontFamily: theme("fontFamily.heading").join(", "),
              fontWeight: "600",
              fontSize: theme("fontSize.2xl[0]"),
              lineHeight: theme("fontSize.2xl[1].lineHeight"),
              marginTop: "2.5rem",
              marginBottom: "1rem",
            },
            h4: {
              fontFamily: theme("fontFamily.heading").join(", "),
              fontWeight: "600",
              fontSize: theme("fontSize.xl[0]"),
            },

            // Links
            a: {
              color: theme("colors.accent.DEFAULT"),
              textDecoration: "underline",
              textDecorationColor: theme("colors.accent.DEFAULT") + "40",
              textUnderlineOffset: "3px",
              transition: "all 0.15s ease",
              "&:hover": {
                textDecorationColor: theme("colors.accent.DEFAULT"),
              },
            },

            // Code blocks
            code: {
              fontFamily: theme("fontFamily.mono").join(", "),
              fontSize: "0.875em",
              fontWeight: "400",
              backgroundColor: theme("colors.surface-card.DEFAULT"),
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },

            // Blockquotes
            blockquote: {
              fontStyle: "italic",
              borderLeftWidth: "3px",
              borderLeftColor: theme("colors.accent.DEFAULT"),
              paddingLeft: "1.25rem",
              color: theme("colors.text-secondary.DEFAULT"),
            },

            // Images
            img: {
              borderRadius: "0.5rem",
              marginTop: "2rem",
              marginBottom: "2rem",
            },

            // HR
            hr: {
              borderColor: theme("colors.border.DEFAULT"),
              marginTop: "3rem",
              marginBottom: "3rem",
            },
          },
        },
        // Dark mode overrides
        invert: {
          css: {
            "--tw-prose-body": theme("colors.text-primary.dark"),
            "--tw-prose-headings": theme("colors.text-primary.dark"),
            "--tw-prose-links": theme("colors.accent.dark"),
            "--tw-prose-bold": theme("colors.text-primary.dark"),
            "--tw-prose-code": theme("colors.text-primary.dark"),
            "--tw-prose-quotes": theme("colors.text-secondary.dark"),
            "--tw-prose-quote-borders": theme("colors.accent.dark"),
            "--tw-prose-counters": theme("colors.text-secondary.dark"),
            "--tw-prose-bullets": theme("colors.text-muted.dark"),
            "--tw-prose-hr": theme("colors.border.dark"),
            "--tw-prose-th-borders": theme("colors.border.dark"),
            "--tw-prose-td-borders": theme("colors.border.dark"),

            a: {
              color: theme("colors.accent.dark"),
              textDecorationColor: theme("colors.accent.dark") + "40",
              "&:hover": {
                textDecorationColor: theme("colors.accent.dark"),
              },
            },

            code: {
              backgroundColor: theme("colors.surface-card.dark"),
            },

            blockquote: {
              borderLeftColor: theme("colors.accent.dark"),
              color: theme("colors.text-secondary.dark"),
            },

            hr: {
              borderColor: theme("colors.border.dark"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
