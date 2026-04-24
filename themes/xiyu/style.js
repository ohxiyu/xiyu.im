/* eslint-disable react/no-danger */
// xiyu theme CSS — 用 dangerouslySetInnerHTML 直接注入 <style>，
// 绕开 styled-jsx 的处理，避免 build/生产环境下作用域/属性加工导致的 selector 失效

const CSS = `
/* xiyu.im — Design System */

:root {
  /* Light — warm paper */
  --bg: #faf7f2;
  --bg-elev: #fffdf9;
  --ink: #1a1612;
  --ink-soft: #2d2720;
  --ink-mute: #6b6358;
  --ink-faint: #a69e92;
  --rule: #e8e1d3;
  --rule-soft: #f0eade;
  --accent: #e67e22;      /* bitcoin-ish orange, slightly desaturated */
  --accent-ink: #b85e10;
  --tag-bg: #f2ede2;
  --tag-ink: #5a5046;
  --selection: #f9dcb6;
}

html.dark {
  --bg: #14110d;
  --bg-elev: #1c1813;
  --ink: #f2ede2;
  --ink-soft: #d9d2c3;
  --ink-mute: #8f877a;
  --ink-faint: #5e574c;
  --rule: #2a251e;
  --rule-soft: #201b15;
  --accent: #f39c3e;
  --accent-ink: #f5b565;
  --tag-bg: #221d16;
  --tag-ink: #a69d8c;
  --selection: #4a3a1e;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: "Noto Sans SC", "PingFang SC", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-feature-settings: "kern", "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  line-height: 1.7;
}

::selection { background: var(--selection); color: var(--ink); }

/* ——— Type ——— */
.serif { font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", Georgia, serif; }
.sans  { font-family: "Noto Sans SC", "PingFang SC", -apple-system, system-ui, sans-serif; }
.mono  { font-family: "JetBrains Mono", "Menlo", "Consolas", ui-monospace, monospace; font-feature-settings: "zero", "ss01"; }

/* ——— Page chrome ——— */
.page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 56px 96px;
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 56px;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
  text-decoration: none;
  color: var(--ink);
}
.brand-mark {
  font-family: "Noto Serif SC", serif;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.brand-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
  transform: translateY(-4px);
}
.brand-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}
.nav-link {
  color: var(--ink-soft);
  text-decoration: none;
  font-size: 14px;
  position: relative;
  padding: 4px 0;
  transition: color .15s;
}
.nav-link:hover { color: var(--accent-ink); }
.nav-link::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .25s cubic-bezier(.2,.7,.3,1);
}
.nav-link:hover::after { transform: scaleX(1); }
.nav-link.active { color: var(--ink); }
.nav-link.active::after { transform: scaleX(1); background: var(--ink); }

.theme-toggle {
  width: 32px; height: 32px;
  border: 1px solid var(--rule);
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: var(--ink-mute);
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.theme-toggle:hover { color: var(--ink); border-color: var(--ink-mute); }

/* ——— Labels ——— */
.eyebrow {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.eyebrow::before {
  content: "";
  width: 18px;
  height: 1px;
  background: var(--accent);
}

/* ——— Article atoms ——— */
.post-num {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--ink-faint);
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}
.post-date {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}
.post-title {
  font-family: "Noto Serif SC", serif;
  color: var(--ink);
  font-weight: 500;
  letter-spacing: -0.005em;
  text-wrap: balance;
}
.post-excerpt {
  color: var(--ink-soft);
  font-size: 14.5px;
  line-height: 1.75;
  text-wrap: pretty;
}
.tag {
  display: inline-block;
  font-size: 11px;
  color: var(--tag-ink);
  background: var(--tag-bg);
  padding: 2px 8px;
  border-radius: 2px;
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 0.02em;
}
.tag-dot {
  color: var(--ink-faint);
  font-size: 11px;
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 0.04em;
}

/* ——— Rules ——— */
.rule { height: 1px; background: var(--rule); border: 0; margin: 0; }
.rule-soft { height: 1px; background: var(--rule-soft); border: 0; margin: 0; }

/* ——— Links with underline reveal ——— */
.inline-link {
  color: var(--ink);
  text-decoration: none;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 100% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  padding-bottom: 1px;
  transition: color .15s;
}
.inline-link:hover { color: var(--accent-ink); }

/* ——— Buttons ——— */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--rule);
  border-radius: 2px;
  color: var(--ink);
  background: transparent;
  font-size: 13px;
  text-decoration: none;
  transition: all .2s;
  font-family: inherit;
  cursor: pointer;
}
.btn-ghost:hover {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--bg);
}

/* ——— Layout helpers ——— */
.two-col {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
  align-items: start;
}

.stack-lg > * + * { margin-top: 48px; }
.stack-md > * + * { margin-top: 28px; }
.stack-sm > * + * { margin-top: 14px; }

/* ——— Noise texture overlay (very subtle) ——— */
.paper-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  opacity: 0.035;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
html.dark .paper-grain { opacity: 0.06; mix-blend-mode: screen; }

/* ——— Footer ——— */
.site-foot {
  margin-top: 120px;
  padding-top: 40px;
  border-top: 1px solid var(--rule);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 12px;
  color: var(--ink-mute);
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 0.04em;
}

/* ——— Scroll ——— */
html { scroll-behavior: smooth; }

/* Page-specific styles */

/* ——— Homepage Hero ——— */
.hero {
  padding: 32px 0 64px;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 72px;
  align-items: end;
}
.hero-eyebrow { margin-bottom: 28px; }
.hero-title {
  font-family: "Noto Serif SC", serif;
  font-size: 64px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-weight: 500;
  margin: 0 0 24px;
  text-wrap: balance;
  color: var(--ink);
}
.hero-title em {
  font-style: italic;
  font-weight: 500;
  color: var(--accent-ink);
  font-family: "Noto Serif SC", Georgia, serif;
}
.hero-subtitle {
  font-size: 17px;
  line-height: 1.75;
  color: var(--ink-soft);
  max-width: 40ch;
  margin: 0 0 32px;
  text-wrap: pretty;
}
.hero-meta {
  display: flex;
  gap: 48px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--ink-mute);
}
.hero-meta-num {
  font-family: "Noto Serif SC", serif;
  font-size: 36px;
  font-weight: 500;
  color: var(--ink);
  display: block;
  line-height: 1;
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
}
.hero-meta-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-card {
  border: 1px solid var(--rule);
  background: var(--bg-elev);
  padding: 28px 32px;
  position: relative;
}
.hero-card::before {
  content: "";
  position: absolute;
  top: -1px; left: -1px;
  width: 12px; height: 12px;
  border-top: 1px solid var(--accent);
  border-left: 1px solid var(--accent);
}
.hero-card::after {
  content: "";
  position: absolute;
  bottom: -1px; right: -1px;
  width: 12px; height: 12px;
  border-bottom: 1px solid var(--accent);
  border-right: 1px solid var(--accent);
}
.hero-card-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.hero-card-label::before {
  content: "";
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.hero-card-quote {
  font-family: "Noto Serif SC", serif;
  font-size: 17px;
  line-height: 1.75;
  color: var(--ink-soft);
  margin: 0;
  font-style: italic;
}
.hero-card-attr {
  margin-top: 14px;
  font-size: 12px;
  color: var(--ink-mute);
  font-family: "JetBrains Mono", monospace;
}

/* ——— Section header ——— */
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 20px 0 24px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 8px;
}
.section-title {
  font-family: "Noto Serif SC", serif;
  font-size: 22px;
  font-weight: 500;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.005em;
}
.section-count {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.08em;
}

/* ——— Featured (first) card ——— */
.feature-card {
  padding: 40px 0 44px;
  border-bottom: 1px solid var(--rule);
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 32px;
  align-items: start;
}
.feature-card .feature-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.feature-body { min-width: 0; }
.feature-title {
  font-size: 34px;
  line-height: 1.25;
  margin: 0 0 18px;
}
.feature-link {
  color: inherit;
  text-decoration: none;
  background-image: linear-gradient(var(--ink), var(--ink));
  background-size: 0% 2px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size .3s cubic-bezier(.2,.7,.3,1), color .15s;
  padding-bottom: 3px;
}
.feature-link:hover { background-size: 100% 2px; }
.feature-excerpt {
  font-size: 16px;
  max-width: 62ch;
  color: var(--ink-soft);
  margin: 0 0 22px;
}
.feature-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* ——— Article row ——— */
.article-row {
  display: grid;
  grid-template-columns: 64px 1fr 160px;
  gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid var(--rule);
  align-items: baseline;
  transition: background .2s;
  position: relative;
}
.article-row::before {
  content: "";
  position: absolute;
  left: -24px;
  top: 28px;
  width: 4px;
  height: 18px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform .25s cubic-bezier(.2,.7,.3,1);
}
.article-row:hover::before { transform: scaleY(1); }
.article-row:hover .row-title { color: var(--accent-ink); }

.row-num-col { padding-top: 4px; }
.row-main { min-width: 0; }
.row-date-col {
  padding-top: 6px;
  text-align: right;
}
.row-title {
  font-size: 20px;
  line-height: 1.35;
  margin: 0 0 10px;
  transition: color .15s;
}
.row-link {
  color: inherit;
  text-decoration: none;
}
.row-flag {
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  margin-right: 8px;
  opacity: 0.75;
}
.row-excerpt {
  font-size: 14px;
  color: var(--ink-mute);
  margin: 0 0 12px;
  max-width: 70ch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.row-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.tag-plain {
  font-size: 11px;
  color: var(--ink-mute);
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 0.02em;
}

/* ——— Pagination ——— */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
}
.page-link {
  color: var(--ink);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: color .15s, gap .2s;
}
.page-link:hover { color: var(--accent-ink); gap: 14px; }
.page-link.disabled { color: var(--ink-faint); pointer-events: none; }
.page-indicator { color: var(--ink-mute); }

/* ——— Article detail page ——— */
.article-hero {
  padding: 24px 0 64px;
  max-width: 780px;
  margin: 0 auto;
}
.article-head-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 0;
}
.article-h1 {
  font-family: "Noto Serif SC", serif;
  font-size: 44px;
  line-height: 1.25;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin: 0 0 28px;
  text-wrap: balance;
}
.article-lead {
  font-family: "Noto Serif SC", serif;
  font-size: 20px;
  line-height: 1.7;
  color: var(--ink-soft);
  font-style: italic;
  padding-left: 20px;
  border-left: 2px solid var(--accent);
  margin: 0 0 48px;
  text-wrap: pretty;
}

.article-body {
  max-width: 680px;
  margin: 0 auto;
  font-size: 16.5px;
  line-height: 1.85;
  color: var(--ink-soft);
}
.article-body h2 {
  font-family: "Noto Serif SC", serif;
  font-size: 26px;
  font-weight: 500;
  color: var(--ink);
  margin: 56px 0 20px;
  letter-spacing: -0.01em;
}
.article-body h3 {
  font-family: "Noto Serif SC", serif;
  font-size: 19px;
  font-weight: 500;
  color: var(--ink);
  margin: 40px 0 14px;
}
.article-body p { margin: 0 0 20px; text-wrap: pretty; }
.article-body p:first-of-type::first-letter {
  font-family: "Noto Serif SC", serif;
  font-size: 3.2em;
  float: left;
  line-height: 0.95;
  padding: 6px 10px 0 0;
  color: var(--accent-ink);
  font-weight: 500;
}
.article-body strong { color: var(--ink); font-weight: 600; }
.article-body blockquote {
  margin: 28px 0;
  padding: 4px 0 4px 22px;
  border-left: 2px solid var(--rule);
  color: var(--ink-mute);
  font-style: italic;
}
.article-body code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.88em;
  background: var(--tag-bg);
  color: var(--ink);
  padding: 2px 6px;
  border-radius: 3px;
}
.article-body pre {
  background: var(--bg-elev);
  border: 1px solid var(--rule);
  padding: 20px 24px;
  margin: 28px 0;
  overflow-x: auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-soft);
}
.article-body pre code {
  background: transparent;
  padding: 0;
}
.article-body ul, .article-body ol {
  padding-left: 24px;
  margin: 0 0 20px;
}
.article-body li { margin: 8px 0; }
.article-body hr {
  border: 0;
  height: 1px;
  background: var(--rule);
  margin: 48px 0;
}
.article-body figure {
  margin: 32px 0;
}
.article-body figcaption {
  font-size: 13px;
  color: var(--ink-mute);
  margin-top: 10px;
  text-align: center;
  font-family: "JetBrains Mono", monospace;
}

/* Inline callout */
.callout {
  border: 1px solid var(--rule);
  background: var(--bg-elev);
  padding: 20px 24px;
  margin: 28px 0;
  position: relative;
  font-size: 15px;
  color: var(--ink-soft);
}
.callout::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--accent);
}

/* Article footer */
.article-foot {
  max-width: 680px;
  margin: 64px auto 0;
  padding-top: 32px;
  border-top: 1px solid var(--rule);
}
.article-foot-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.prev-next {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 40px;
}
.pn-card {
  padding: 20px 24px;
  border: 1px solid var(--rule);
  text-decoration: none;
  color: var(--ink);
  transition: all .2s;
  background: var(--bg);
}
.pn-card:hover {
  border-color: var(--ink);
  background: var(--bg-elev);
}
.pn-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 8px;
}
.pn-title {
  font-family: "Noto Serif SC", serif;
  font-size: 16px;
  line-height: 1.4;
  color: var(--ink);
}
.pn-right { text-align: right; }

/* TOC sidebar */
.article-layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 48px;
  max-width: 1180px;
  margin: 0 auto;
}
.toc {
  position: sticky;
  top: 40px;
  padding-top: 24px;
  font-size: 13px;
  align-self: start;
}
.toc-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-list li { margin: 10px 0; line-height: 1.4; }
.toc-link {
  color: var(--ink-mute);
  text-decoration: none;
  border-left: 1px solid transparent;
  padding-left: 12px;
  margin-left: -13px;
  display: block;
  transition: all .15s;
}
.toc-link:hover, .toc-link.active {
  color: var(--ink);
  border-left-color: var(--accent);
}

.article-side {
  padding-top: 24px;
  font-size: 13px;
}
.side-stat {
  margin-bottom: 24px;
}
.side-stat-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 6px;
}
.side-stat-value {
  font-family: "Noto Serif SC", serif;
  font-size: 18px;
  color: var(--ink);
}

/* ——— Archive page ——— */
.archive-head {
  margin-bottom: 56px;
}
.archive-title {
  font-family: "Noto Serif SC", serif;
  font-size: 56px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin: 20px 0 18px;
}
.archive-sub {
  color: var(--ink-soft);
  font-size: 16px;
  max-width: 55ch;
}

.archive-year {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 48px;
  padding: 40px 0;
  border-top: 1px solid var(--rule);
  align-items: start;
}
.archive-year:last-child { border-bottom: 1px solid var(--rule); }
.year-label {
  font-family: "Noto Serif SC", serif;
  font-size: 48px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  position: sticky;
  top: 40px;
}
.year-count {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  margin-top: 10px;
  letter-spacing: 0.06em;
}
.year-list {
  display: flex;
  flex-direction: column;
}
.archive-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 24px;
  padding: 14px 0;
  border-bottom: 1px dashed var(--rule);
  align-items: baseline;
  text-decoration: none;
  color: var(--ink);
  transition: color .15s, padding .2s;
}
.archive-item:last-child { border-bottom: 0; }
.archive-item:hover {
  color: var(--accent-ink);
  padding-left: 12px;
}
.archive-item-title {
  font-family: "Noto Serif SC", serif;
  font-size: 16px;
  line-height: 1.4;
}
.archive-item-date {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  white-space: nowrap;
}

/* ——— About page ——— */
.about-hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
  padding: 32px 0 80px;
  align-items: start;
  border-bottom: 1px solid var(--rule);
}
.about-h1 {
  font-family: "Noto Serif SC", serif;
  font-size: 72px;
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.025em;
  margin: 20px 0 32px;
}
.about-lead {
  font-family: "Noto Serif SC", serif;
  font-size: 20px;
  line-height: 1.7;
  color: var(--ink-soft);
  max-width: 32ch;
  font-style: italic;
}
.portrait-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
}
.portrait {
  width: 280px;
  height: 340px;
  background: linear-gradient(135deg, #e8dfd0 0%, #d4c5a8 100%);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--rule);
}
html.dark .portrait {
  background: linear-gradient(135deg, #2a251e 0%, #3a322a 100%);
}
.portrait-glyph {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Serif SC", serif;
  font-size: 160px;
  color: var(--accent);
  font-weight: 500;
  opacity: 0.85;
  line-height: 1;
}
.portrait-scrim {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, transparent 40%, rgba(0,0,0,0.15) 100%);
}
.portrait-caption {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  letter-spacing: 0.08em;
  text-align: right;
  max-width: 280px;
}

.about-body {
  max-width: 680px;
  margin: 64px auto 0;
  font-size: 16.5px;
  line-height: 1.85;
  color: var(--ink-soft);
}
.about-body p { margin: 0 0 20px; text-wrap: pretty; }
.about-body p strong { color: var(--ink); font-weight: 600; }

.about-facts {
  margin: 72px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.fact {
  padding: 32px 28px;
  border-right: 1px solid var(--rule);
}
.fact:last-child { border-right: 0; }
.fact-num {
  font-family: "Noto Serif SC", serif;
  font-size: 44px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 10px;
  font-variant-numeric: tabular-nums;
}
.fact-num .unit {
  font-size: 16px;
  color: var(--ink-mute);
  margin-left: 4px;
  font-weight: 400;
}
.fact-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
}

.elsewhere {
  margin: 72px 0;
}
.elsewhere-title {
  font-family: "Noto Serif SC", serif;
  font-size: 22px;
  margin: 0 0 24px;
}
.link-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
.link-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid var(--rule);
  text-decoration: none;
  color: var(--ink);
  transition: color .15s;
}
.link-row:hover { color: var(--accent-ink); }
.link-platform {
  font-family: "Noto Serif SC", serif;
  font-size: 17px;
}
.link-handle {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--ink-mute);
}

/* Topics wall */
.topics-wrap {
  padding: 56px 0;
}
.topics-head {
  margin-bottom: 36px;
}
.topics-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
  border-top: 1px solid var(--rule);
  border-left: 1px solid var(--rule);
}
.topic-cell {
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 20px 18px;
  text-decoration: none;
  color: var(--ink);
  transition: background .2s, color .15s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 108px;
}
.topic-cell:hover {
  background: var(--bg-elev);
  color: var(--accent-ink);
}
.topic-name {
  font-family: "Noto Serif SC", serif;
  font-size: 18px;
  line-height: 1.3;
}
.topic-count {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-mute);
  margin-top: 12px;
}

/* ——— Colophon / tech stack ——— */
.colophon {
  padding: 56px 0 24px;
  border-top: 1px solid var(--rule);
  margin-top: 40px;
}
.colophon-head { margin-bottom: 36px; }

.stack-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border-top: 1px solid var(--rule);
  border-left: 1px solid var(--rule);
}
.stack-item {
  padding: 32px 32px 36px;
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.stack-num {
  position: absolute;
  top: 24px;
  right: 28px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: 0.08em;
}
.stack-role {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 10px;
}
.stack-name {
  font-family: "Noto Serif SC", serif;
  font-size: 28px;
  color: var(--ink);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}
.stack-note {
  font-size: 14.5px;
  color: var(--ink-soft);
  line-height: 1.75;
  margin: 0;
  max-width: 42ch;
  text-wrap: pretty;
}

.workflow {
  margin-top: 40px;
  padding: 28px 32px;
  border: 1px solid var(--rule);
  background: var(--bg-elev);
}
.workflow-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 18px;
}
.workflow-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.wf-step {
  font-family: "Noto Serif SC", serif;
  font-size: 15px;
  color: var(--ink);
  padding: 6px 12px;
  background: var(--bg);
  border: 1px solid var(--rule);
}
.wf-step.accent {
  border-color: var(--accent);
  color: var(--accent-ink);
}
.wf-arrow {
  font-family: "JetBrains Mono", monospace;
  color: var(--ink-faint);
  font-size: 14px;
}
.workflow-note {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-mute);
  line-height: 1.7;
}

/* ——— Canvas rig ——— */
body.canvas-mode { overflow: hidden; }
.page-frame {
  width: 1320px;
  background: var(--bg);
  color: var(--ink);
  position: relative;
  overflow: hidden;
}
.page-frame .page { padding-top: 40px; padding-bottom: 56px; }


/* ===== NotionPage 渲染兼容层 ===== */
.article-body .notion { color: inherit; }
.article-body .notion-text { margin: 0 0 20px; line-height: 1.85; }
.article-body .notion-h,
.article-body .notion-h1,
.article-body .notion-h2,
.article-body .notion-h3 {
  font-family: "Noto Serif SC", serif;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.article-body .notion-h1 { font-size: 30px; margin: 64px 0 22px; }
.article-body .notion-h2 { font-size: 26px; margin: 56px 0 20px; }
.article-body .notion-h3 { font-size: 19px; margin: 40px 0 14px; }
.article-body .notion-quote {
  margin: 28px 0; padding: 4px 0 4px 22px;
  border-left: 2px solid var(--rule);
  color: var(--ink-mute); font-style: italic;
}
.article-body .notion-inline-code,
.article-body .notion-code-inline {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.88em; background: var(--tag-bg);
  color: var(--ink); padding: 2px 6px; border-radius: 3px;
}
.article-body .notion-code {
  background: var(--bg-elev); border: 1px solid var(--rule);
  padding: 20px 24px; margin: 28px 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 13.5px; line-height: 1.7; color: var(--ink-soft);
}
.article-body .notion-callout {
  border: 1px solid var(--rule); background: var(--bg-elev);
  padding: 20px 24px; margin: 28px 0; position: relative;
}
.article-body .notion-callout::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: var(--accent);
}
.article-body .notion-hr, .article-body hr {
  border: 0; height: 1px; background: var(--rule); margin: 48px 0;
}
.article-body .notion-link {
  color: var(--ink);
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 100% 1px; background-position: 0 100%;
  background-repeat: no-repeat; padding-bottom: 1px;
  text-decoration: none; transition: color .15s;
}
.article-body .notion-link:hover { color: var(--accent-ink); }
.article-body .notion > .notion-text:first-of-type::first-letter,
.article-body .notion-page-content > .notion-text:first-of-type::first-letter {
  font-family: "Noto Serif SC", serif; font-size: 3.2em;
  float: left; line-height: 0.95; padding: 6px 10px 0 0;
  color: var(--accent-ink); font-weight: 500;
}

/* 把 :root 下的 CSS 变量同时挂到 #theme-xiyu，避免被外层覆盖 */
#theme-xiyu {
  --bg: #faf7f2; --bg-elev: #fffdf9;
  --ink: #1a1612; --ink-soft: #2d2720; --ink-mute: #6b6358; --ink-faint: #a69e92;
  --rule: #e8e1d3; --rule-soft: #f0eade;
  --accent: #e67e22; --accent-ink: #b85e10;
  --tag-bg: #f2ede2; --tag-ink: #5a5046; --selection: #f9dcb6;
}
html.dark #theme-xiyu {
  --bg: #14110d; --bg-elev: #1c1813;
  --ink: #f2ede2; --ink-soft: #d9d2c3; --ink-mute: #8f877a; --ink-faint: #5e574c;
  --rule: #2a251e; --rule-soft: #201b15;
  --accent: #f39c3e; --accent-ink: #f5b565;
  --tag-bg: #221d16; --tag-ink: #a69d8c; --selection: #4a3a1e;
}

/* ===== xiyu Nav logo ===== */
.brand-logo {
  display: inline-block;
  vertical-align: middle;
  margin-right: 2px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* ============================================================
   移动端适配：≤ 1024 / ≤ 768 / ≤ 480
   ============================================================ */

/* —— 平板 (≤1024px) —— */
@media (max-width: 1024px) {
  .page { padding: 32px 28px 80px; }
  .article-layout {
    grid-template-columns: 1fr !important;
    gap: 0;
    max-width: 780px;
  }
  .toc { display: none; }
  .article-side {
    display: flex;
    flex-direction: row;
    gap: 40px;
    flex-wrap: wrap;
    border-top: 1px solid var(--rule);
    padding-top: 24px;
    margin-top: 48px;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }
  .article-side .side-stat { margin-bottom: 0; }
  .stack-grid { grid-template-columns: 1fr; }
  .topics-grid { grid-template-columns: repeat(3, 1fr); }
  .about-hero { gap: 48px; }
  .hero { gap: 48px; }
}

/* —— 手机 (≤768px) —— */
@media (max-width: 768px) {
  html, body { line-height: 1.65; }
  .page { padding: 20px 18px 64px; }

  /* Nav 变紧凑 + 换行支持 */
  .site-nav {
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 18px;
    margin-bottom: 28px;
  }
  .brand { gap: 8px; }
  .brand-mark { font-size: 22px; }
  .brand-tag { display: none; }
  .nav-links { gap: 16px; flex-wrap: wrap; }
  .nav-link { font-size: 13px; padding: 2px 0; }

  /* Hero 变一列 */
  .hero {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 16px 0 40px;
  }
  .hero-eyebrow { margin-bottom: 18px; }
  .hero-title { font-size: 38px; line-height: 1.2; margin-bottom: 18px; }
  .hero-subtitle { font-size: 15px; margin-bottom: 24px; max-width: 100%; }
  .hero-meta { gap: 28px; flex-wrap: wrap; }
  .hero-meta-num { font-size: 28px; }
  .hero-card { padding: 22px 24px; }
  .hero-card-quote { font-size: 15px; line-height: 1.7; }

  /* 文章卡片变堆叠 */
  .section-head { padding: 14px 0 16px; margin-bottom: 4px; }
  .section-title { font-size: 18px; }
  .feature-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 28px 0 32px;
  }
  .feature-title { font-size: 26px; line-height: 1.3; margin-bottom: 12px; }
  .feature-excerpt { font-size: 14.5px; margin-bottom: 16px; }

  .article-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 22px 0;
  }
  .article-row::before { display: none; }
  .row-num-col { padding-top: 0; order: 2; }
  .row-main { order: 1; }
  .row-date-col { order: 3; padding-top: 0; text-align: left; }
  .row-title { font-size: 17px; }
  .row-excerpt { font-size: 13.5px; }
  .row-date-col .post-date { font-size: 11px; }

  /* 归档 */
  .archive-head { margin-bottom: 28px; }
  .archive-title { font-size: 32px; }
  .archive-year {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 24px 0;
  }
  .year-label {
    position: static;
    font-size: 28px;
    display: inline-block;
  }
  .year-count { display: inline-block; margin-top: 0; margin-left: 12px; }
  .archive-item {
    grid-template-columns: auto 1fr;
    grid-template-areas: "num title" "date date";
    gap: 8px 12px;
    padding: 12px 0;
  }
  .archive-item .post-num { grid-area: num; }
  .archive-item-title { grid-area: title; font-size: 15px; }
  .archive-item-date { grid-area: date; }
  .archive-item:hover { padding-left: 0; }

  /* 文章详情 */
  .article-hero { padding: 0 0 36px; }
  .article-head-meta { flex-wrap: wrap; gap: 8px 14px; margin-bottom: 18px; }
  .article-h1 { font-size: 30px; line-height: 1.25; margin-bottom: 18px; }
  .article-lead { font-size: 16px; padding-left: 16px; margin-bottom: 32px; }
  .article-body { font-size: 16px; }
  .article-body h2 { font-size: 22px; margin: 40px 0 14px; }
  .article-body h3 { font-size: 17px; margin: 28px 0 10px; }
  .article-body .notion-h1 { font-size: 24px; margin: 40px 0 14px; }
  .article-body .notion-h2 { font-size: 22px; margin: 40px 0 14px; }
  .article-body .notion-h3 { font-size: 17px; margin: 28px 0 10px; }

  .prev-next { grid-template-columns: 1fr; gap: 12px; margin-top: 28px; }
  .pn-right { text-align: left; }

  /* 关于 */
  .about-hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 16px 0 40px;
  }
  .about-h1 { font-size: 48px; line-height: 1.1; margin: 16px 0 20px; }
  .about-lead { font-size: 17px; max-width: 100%; }
  .portrait-col { align-items: flex-start; }
  .portrait { width: 100%; max-width: 280px; height: 260px; }
  .portrait-glyph { font-size: 120px; }
  .portrait-caption { text-align: left; }

  .about-body { font-size: 15.5px; margin: 40px auto 0; }
  .about-facts {
    grid-template-columns: repeat(2, 1fr);
    margin: 48px 0;
  }
  .fact { padding: 22px 18px; }
  .fact:nth-child(2) { border-right: 0; }
  .fact:nth-child(1), .fact:nth-child(2) { border-bottom: 1px solid var(--rule); }
  .fact-num { font-size: 32px; }

  .elsewhere { margin: 48px 0; }
  .link-list { grid-template-columns: 1fr; }
  .link-platform { font-size: 16px; }

  .topics-wrap { padding: 40px 0; }
  .topics-grid { grid-template-columns: repeat(2, 1fr); }
  .topic-cell { padding: 16px 14px; min-height: 88px; }
  .topic-name { font-size: 16px; }

  .colophon { padding: 40px 0 16px; margin-top: 24px; }
  .stack-item { padding: 24px 22px; }
  .stack-name { font-size: 22px; }
  .workflow { padding: 20px 22px; }
  .workflow-line { gap: 8px; }
  .wf-step { font-size: 13px; padding: 4px 8px; }

  /* 页脚 */
  .site-foot {
    flex-direction: column;
    gap: 8px;
    margin-top: 72px;
    padding-top: 28px;
    font-size: 11px;
  }
}

/* —— 小屏 (≤480px) —— */
@media (max-width: 480px) {
  .page { padding: 16px 14px 56px; }
  .hero-title { font-size: 30px; }
  .archive-title { font-size: 26px; }
  .about-h1 { font-size: 36px; }
  .feature-title { font-size: 22px; }
  .article-h1 { font-size: 24px; }
  .about-facts { grid-template-columns: 1fr; }
  .fact { border-right: 0 !important; border-bottom: 1px solid var(--rule); }
  .fact:last-child { border-bottom: 0; }
  .topics-grid { grid-template-columns: 1fr; }
  .hero-meta { gap: 20px; }
  .hero-meta > div { flex: 1 1 auto; }
}
`

export const Style = () => (
  <style dangerouslySetInnerHTML={{ __html: CSS }} />
)

export default Style
