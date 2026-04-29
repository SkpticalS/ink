/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "xuan-white": "#F7F2E8",
        "xuan-warm": "#F5EDE0",
        "xuan-aged": "#EDE4D3",
        "ink-900": "#1A1A1A",
        "ink-700": "#3D3D3D",
        "ink-500": "#6B6B6B",
        "ink-300": "#9E9E9E",
        "gold-600": "#C4963D",
        "gold-500": "#D4A84B",
        "gold-300": "#E8C87A",
        "gold-100": "#F5E6C3",
        "cinnabar": "#B54A3F",
        "cinnabar-light": "#D4736A",
        "stone-blue": "#5A7A96",
        "stone-green": "#6B8E6B",
      },
      fontFamily: {
        display: ["'LXGW WenKai'", "'LXGW WenKai Screen'", "'Noto Serif SC'", "serif"],
        title: ["'LXGW WenKai'", "'LXGW WenKai Screen'", "'Noto Serif SC'", "serif"],
        chapter: ["'LXGW WenKai'", "'LXGW WenKai Screen'", "'Noto Serif SC'", "serif"],
        body: ["'LXGW WenKai'", "'LXGW WenKai Screen'", "'PingFang SC'", "'Microsoft YaHei'", "sans-serif"],
        annotation: ["'LXGW WenKai'", "'LXGW WenKai Screen'", "'PingFang SC'", "'Microsoft YaHei'", "sans-serif"],
        wenkai: ["'LXGW WenKai'", "'LXGW WenKai Screen'", "'Noto Serif SC'", "serif"],
        mono: ["'LXGW WenKai'", "'Noto Sans SC'", "sans-serif"],
      },
      borderRadius: {
        "page": "4px 2px 6px 3px",
        "card": "3px 5px 2px 4px",
        "btn": "2px",
      },
      boxShadow: {
        "paper": "0 1px 3px rgba(26, 26, 26, 0.04), 0 1px 1px rgba(26, 26, 26, 0.03)",
        "scroll": "0 4px 20px rgba(26, 26, 26, 0.08), 0 1px 3px rgba(26, 26, 26, 0.05)",
        "seal": "0 2px 8px rgba(181, 74, 63, 0.15)",
      },
      letterSpacing: {
        "display": "0.08em",
        "title": "0.05em",
        "chapter": "0.03em",
        "body": "0.02em",
        "annotation": "0.01em",
        "seal": "0.05em",
      },
      lineHeight: {
        "display": "1.3",
        "title": "1.4",
        "chapter": "1.5",
        "body": "1.8",
        "annotation": "1.6",
      },
      transitionTimingFunction: {
        "brush": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
        "seal-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
}