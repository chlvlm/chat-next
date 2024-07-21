import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.no-scrollbar-y': {
          'overflow-y': 'scroll',
          'scrollbar-width': 'none', // Firefox
          '-ms-overflow-style': 'none', // IE and Edge
          '&::-webkit-scrollbar': {
            display: 'none', // Safari and Chrome
          },
        },
      }
      addUtilities(newUtilities, {
        variants: ['responsive', 'hover'],
      } as any)
    }),
  ],
}
export default config
