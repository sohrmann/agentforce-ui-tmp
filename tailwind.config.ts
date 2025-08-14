import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/chat/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        herokuMain: '#5a1ba9',
        salesforceMain: '#0176d3',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: '1.5em',
            },
            h2: {
              fontSize: '1.25em',
            },
            h3: {
              fontSize: '1.1em',
            },
            h4: {
              fontSize: '1em',
            },
            h5: {
              fontSize: '0.875em',
            },
            h6: {
              fontSize: '0.85em',
            },
            'p, blockquote, pre, ol, ul, li, h1, h2, h3, h4': {
              margin: '0',
            },
            'li > p': {
              margin: '0',
            },
            'li': {
              margin: '0',
            },
            'p + p': {
              marginTop: '0.5em',
            },
            '--tw-prose-invert-body': '#ffffff',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
