import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import expressiveCode from "astro-expressive-code";

export default defineConfig({
  site: "https://alephblog.netlify.app",
  integrations: [
    expressiveCode({
      themes: ["github-dark-dimmed", "github-light"],
      styleOverrides: {
        borderRadius: "0.5rem",
        codePaddingBlock: "1rem",
        codePaddingInline: "1.25rem",
        codeFontFamily:
          "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        codeFontSize: "0.875rem",
        codeLineHeight: "1.6",
      },
    }),
    mdx(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
    },
  },
});
