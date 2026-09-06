const BLOG = require('./blog.config')
const { fontFamilies } = require('./lib/utils/font')

module.exports = {
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './themes/**/*.js'
  ],
  darkMode: BLOG.APPEARANCE === 'class' ? 'media' : 'class', // or 'media' or 'class'
  theme: {
    fontFamily: fontFamilies,
    screens: {
      sm: '540px',
      // => @media (min-width: 576px) { ... }
      md: '720px',
      // => @media (min-width: 768px) { ... }
      lg: '960px',
      // => @media (min-width: 992px) { ... }
      xl: '1140px',
      // => @media (min-width: 1200px) { ... }
      '2xl': '1536px'
    },
    container: {
      center: true,
      padding: '16px'
    },
    extend: {
      colors: {
        // ── xiyu 设计令牌桥 ──
        // 值来自 public/css/xiyu.css 的 CSS 变量，明暗自动跟随 html.dark。
        // 这样 shadcn 组件用 Tailwind 工具类写样式时，颜色和站点其余部分同源。
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
          mute: 'rgb(var(--ink-mute-rgb) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint-rgb) / <alpha-value>)'
        },
        paper: {
          DEFAULT: 'rgb(var(--bg-rgb) / <alpha-value>)',
          elev: 'rgb(var(--bg-elev-rgb) / <alpha-value>)'
        },
        rule: {
          DEFAULT: 'rgb(var(--rule-rgb) / <alpha-value>)',
          soft: 'rgb(var(--rule-soft-rgb) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink-rgb) / <alpha-value>)'
        },
        tagc: {
          bg: 'rgb(var(--tag-bg-rgb) / <alpha-value>)',
          ink: 'rgb(var(--tag-ink-rgb) / <alpha-value>)'
        },
        selection: 'rgb(var(--selection-rgb) / <alpha-value>)',

        day: {
          DEFAULT: BLOG.BACKGROUND_LIGHT || '#ffffff'
        },
        night: {
          DEFAULT: BLOG.BACKGROUND_DARK || '#111827'
        },
        hexo: {
          'background-gray': '#f5f5f5',
          'black-gray': '#101414',
          'light-gray': '#e5e5e5'
        },
        // black: '#212b36',
        'dark-700': '#090e34b3',
        dark: {
          DEFAULT: '#111928',
          2: '#1F2A37',
          3: '#374151',
          4: '#4B5563',
          5: '#6B7280',
          6: '#9CA3AF',
          7: '#D1D5DB',
          8: '#E5E7EB'
        },
        primary: '#3758F9',
        'blue-dark': '#1B44C8',
        secondary: '#13C296',
        'body-color': '#637381',
        'body-secondary': '#8899A8',
        warning: '#FBBF24',
        stroke: '#DFE4EA',
        'gray-1': '#F9FAFB',
        'gray-2': '#F3F4F6',
        'gray-7': '#CED4DA'
      },
      borderRadius: {
        // 站点是锐角设计：标签 2px、按钮/输入 3px、面板 4px。
        // 刻意不使用 Tailwind 默认的 rounded-md(6px)/lg(8px)。
        tag: '2px',
        ctl: '3px',
        panel: '4px',
        card: '16px'
      },
      fontFamily: {
        // 独立命名，不去覆盖全站已有的 font-sans / font-serif。
        // 站点主字体由 lib/utils/font.js 决定，这里只补 shadcn 组件要用的两个。
        'xiyu-serif': ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'Georgia', 'serif'],
        'xiyu-mono': ['"JetBrains Mono"', 'Menlo', 'Consolas', 'ui-monospace', 'monospace']
      },
      maxWidth: {
        side: '14rem',
        '9/10': '90%',
        'screen-3xl': '1440px',
        'screen-4xl': '1560px'
      },
      boxShadow: {
        input: '0px 7px 20px rgba(0, 0, 0, 0.03)',
        form: '0px 1px 55px -11px rgba(0, 0, 0, 0.01)',
        pricing: '0px 0px 40px 0px rgba(0, 0, 0, 0.08)',
        'switch-1': '0px 0px 5px rgba(0, 0, 0, 0.15)',
        testimonial: '0px 10px 20px 0px rgba(92, 115, 160, 0.07)',
        'testimonial-btn': '0px 8px 15px 0px rgba(72, 72, 138, 0.08)',
        1: '0px 1px 3px 0px rgba(166, 175, 195, 0.40)',
        2: '0px 5px 12px 0px rgba(0, 0, 0, 0.10)'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('tailwindcss-animate')]
}
