/* eslint-disable react/no-danger */
// xiyu theme CSS — 用 dangerouslySetInnerHTML 直接注入 <style>，
// 绕开 styled-jsx 的处理，避免 build/生产环境下作用域/属性加工导致的 selector 失效

export const CSS = `
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
  /* 防御：宽度边界（不再 overflow-x:hidden，避免内容被裁掉用户也滑不到） */
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
}

/* 主题容器 + 所有后代统一 box-sizing，padding 不再让子元素超出 */
#theme-xiyu, #theme-xiyu *, #theme-xiyu *::before, #theme-xiyu *::after {
  box-sizing: border-box;
}
#theme-xiyu { width: 100%; max-width: 100vw; }

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
/* 自动副文案：最近写了 + 在想 —— 数据从 props.posts 算，零维护 */
.hero-status {
  margin: 0 0 32px;
  max-width: 48ch;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hero-status-line {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-soft);
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.hero-status-label {
  flex: 0 0 auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-mute);
  position: relative;
  padding-left: 24px;
}
.hero-status-label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 16px;
  height: 1px;
  background: var(--accent);
}
.hero-status-latest {
  flex: 1 1 auto;
  color: var(--ink);
  text-decoration: none;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size .25s ease, color .15s;
}
.hero-status-latest:hover {
  color: var(--accent-ink);
  background-size: 100% 1px;
}
.hero-status-topics { flex: 1 1 auto; }
.hero-status-dot { color: var(--ink-faint); margin: 0 2px; }

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

/* ===== .about-body 内 Notion 正文兼容（保持和设计稿 .about-body p 一致的节奏） ===== */
.about-body .notion { color: inherit; }
.about-body .notion-text {
  margin: 0 0 20px;
  line-height: 1.85;
  font-size: inherit;
  color: var(--ink-soft);
  text-wrap: pretty;
}
.about-body .notion-text strong,
.about-body .notion-text b { color: var(--ink); font-weight: 600; }
.about-body .notion-h,
.about-body .notion-h1,
.about-body .notion-h2,
.about-body .notion-h3 {
  font-family: "Noto Serif SC", serif;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.about-body .notion-h1 { font-size: 26px; margin: 40px 0 18px; }
.about-body .notion-h2 { font-size: 22px; margin: 36px 0 16px; }
.about-body .notion-h3 { font-size: 18px; margin: 28px 0 12px; }
.about-body .notion-link {
  color: var(--ink);
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 100% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  padding-bottom: 1px;
  text-decoration: none;
  transition: color .15s;
}
.about-body .notion-link:hover { color: var(--accent-ink); }
.about-body .notion-quote {
  margin: 24px 0;
  padding: 4px 0 4px 20px;
  border-left: 2px solid var(--rule);
  color: var(--ink-mute);
  font-style: italic;
}
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

/* ===== 隐藏 react-notion-x 默认渲染的"页面属性区"（类型/分类/标题/日期 等） =====
   有些文章的 Notion blockMap 会带 page-header / properties block，
   渲染出来就是用户看到的 '和 notion 一样的页面 类型 分类 标题'。
   xiyu 主题已经在 LayoutSlug 自己的 .article-hero 里提供了 #编号/日期/标签/标题/lead，
   所以 .article-body 内部不再需要 Notion 自带的页面头。 */
.article-body .notion-page-no-cover,
.article-body .notion-page-cover-wrapper,
.article-body .notion-page-cover,
.article-body .notion-collection-header,
.article-body .notion-collection-page-properties,
.article-body .notion-page-properties,
.article-body .notion-page-property,
.article-body .notion-property-title-page,
.article-body > .notion-page-header,
.article-body .notion-page-header,
.article-body > .notion-title,
.article-body > h1.notion-h1:first-child {
  display: none !important;
}
/* 顶部 Cover image 也不需要（xiyu 是文字博客没有大图风格） */
.article-body .notion-page-cover-hero { display: none !important; }

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

/* ——— 全局长内容兜底：阻止 Notion 渲染的代码块/表格/图片/嵌入内容撑破移动视口 ——— */
.article-body { overflow-wrap: break-word; word-break: break-word; }
.article-body img,
.article-body video,
.article-body iframe,
.article-body .notion-asset-wrapper,
.article-body .notion-asset-wrapper img,
.about-body img,
.about-body video,
.about-body iframe { max-width: 100%; height: auto; }
.article-body pre,
.article-body .notion-code,
.article-body code { max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.article-body table,
.article-body .notion-table,
.article-body .notion-simple-table,
.article-body .notion-collection-row { display: block; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.article-body .notion-code pre,
.article-body .notion-code code { white-space: pre; word-break: normal; overflow-wrap: normal; }
.article-body .notion-bookmark,
.article-body .notion-bookmark-link { max-width: 100%; box-sizing: border-box; }
.article-body .notion-asset-wrapper-video,
.article-body .notion-asset-wrapper-embed { max-width: 100%; }
.article-body .notion-asset-wrapper-video > div,
.article-body .notion-asset-wrapper-embed > div { max-width: 100% !important; }

/* ============================================================================
   响应式（≤1024 平板 / ≤768 手机）—— 重写为最小化、单一来源、不与桌面冲突
   核心原则：
   1. 手机不用 grid，全部退回 block 流，避免 grid 子元素 min-content 撑出 viewport
   2. 隐藏 TOC + ArticleSide
   3. 强约束容器宽度，但允许 pre/table/code 自身横向滚
============================================================================ */

@media (max-width: 1024px) {
  .page { padding: 32px 28px 80px; }
  /* 平板：article-layout 三栏先收成单栏，TOC 隐藏 */
  .article-layout {
    display: block;
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
  .toc { display: none; }
  /* 平板：ArticleSide 横排放在文章正下方 */
  .article-side {
    display: flex;
    flex-direction: row;
    gap: 32px;
    flex-wrap: wrap;
    border-top: 1px solid var(--rule);
    padding-top: 24px;
    margin-top: 48px;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }
  .article-side .side-stat { margin-bottom: 0; }
  /* 关于页等收紧 */
  .about-hero { gap: 48px; }
  .hero { gap: 48px; }
  .topics-grid { grid-template-columns: repeat(3, 1fr); }
  .stack-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  /* —— 全局基础 —— */
  .page { padding: 18px 16px 56px; max-width: 100%; }

  /* —— Nav 紧凑换行 —— */
  .site-nav { flex-wrap: wrap; gap: 12px; padding-bottom: 16px; margin-bottom: 24px; }
  .brand { gap: 8px; }
  .brand-mark { font-size: 22px; }
  .brand-tag { display: none; }
  .nav-links { gap: 14px; flex-wrap: wrap; }
  .nav-link { font-size: 13px; padding: 2px 0; }

  /* —— 首页 Hero —— */
  .hero { display: block; padding: 12px 0 36px; }
  .hero > div + div, .hero > aside { margin-top: 28px; }
  .hero-eyebrow { margin-bottom: 16px; }
  .hero-title { font-size: 36px; line-height: 1.2; margin-bottom: 16px; }
  .hero-subtitle { font-size: 15px; max-width: 100%; margin-bottom: 24px; }
  .hero-meta { gap: 24px; flex-wrap: wrap; }
  .hero-meta-num { font-size: 28px; }
  .hero-card { padding: 22px 24px; }
  .hero-card-quote { font-size: 15px; line-height: 1.7; }

  /* —— 列表 —— */
  .section-head { padding: 14px 0 16px; margin-bottom: 4px; }
  .section-title { font-size: 18px; }
  .feature-card {
    display: block;
    padding: 24px 0 28px;
  }
  .feature-card .feature-meta { display: flex; gap: 12px; margin-bottom: 8px; }
  .feature-title { font-size: 24px; line-height: 1.3; margin-bottom: 12px; }
  .feature-excerpt { font-size: 14.5px; margin-bottom: 14px; }

  .article-row {
    display: block;
    padding: 20px 0;
  }
  .article-row::before { display: none; }
  .row-num-col { display: inline; }
  .row-num-col .post-num { display: inline-block; margin-bottom: 6px; }
  .row-main { width: 100%; }
  .row-title { font-size: 17px; margin-bottom: 8px; }
  .row-excerpt { font-size: 13.5px; margin-bottom: 8px; }
  .row-date-col { display: block; text-align: left; padding-top: 6px; }
  .row-date-col .post-date { font-size: 11px; }

  /* —— 归档 —— */
  .archive-head { margin-bottom: 28px; }
  .archive-title { font-size: 30px; }
  .archive-year { display: block; padding: 24px 0; }
  .year-label { position: static; font-size: 28px; display: inline-block; }
  .year-count { display: inline-block; margin: 0 0 0 12px; }
  .year-list { margin-top: 12px; }
  .archive-item {
    grid-template-columns: auto 1fr;
    grid-template-areas: "num title" "date date";
    gap: 4px 12px;
    padding: 12px 0;
  }
  .archive-item .post-num { grid-area: num; }
  .archive-item-title { grid-area: title; font-size: 15px; }
  .archive-item-date { grid-area: date; }
  .archive-item:hover { padding-left: 0; }

  /* —— 文章详情：完全 block 流，没有 grid，永不可能溢出 —— */
  .article-layout { display: block; padding: 0; max-width: 100%; }
  article { display: block; max-width: 100%; }
  .article-side { display: none !important; }
  .article-hero { padding: 4px 0 24px; max-width: 100%; }
  .article-head-meta { font-size: 11px; gap: 6px 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .article-head-meta .tag-plain:nth-of-type(n+5),
  .article-head-meta .tag-dot:nth-of-type(n+5) { display: none; }
  .article-h1 { font-size: 26px; line-height: 1.25; margin-bottom: 14px; letter-spacing: -0.01em; }
  .article-lead { font-size: 15px; line-height: 1.65; padding-left: 12px; margin-bottom: 24px; }

  .article-body {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    font-size: 15.5px;
    line-height: 1.78;
    /* 长 URL / 英文不撑出 */
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .article-body * { max-width: 100%; }
  .article-body img, .article-body video, .article-body iframe {
    max-width: 100% !important; height: auto;
  }
  /* 代码块、表格等需要可水平滚动 */
  .article-body pre, .article-body table, .article-body .notion-code,
  .article-body .notion-table, .article-body .notion-simple-table,
  .article-body .notion-collection-row {
    max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;
  }
  .article-body h2, .article-body .notion-h1, .article-body .notion-h2 {
    font-size: 21px; margin: 32px 0 12px;
  }
  .article-body h3, .article-body .notion-h3 { font-size: 17px; margin: 24px 0 10px; }
  .article-body p, .article-body .notion-text { margin: 0 0 16px; }
  .article-body p:first-of-type::first-letter,
  .article-body .notion > .notion-text:first-of-type::first-letter,
  .article-body .notion-page-content > .notion-text:first-of-type::first-letter {
    font-size: 2.4em; padding: 4px 8px 0 0;
  }
  .article-body blockquote, .article-body .notion-quote {
    margin: 18px 0; padding: 4px 0 4px 14px;
  }
  .article-body pre, .article-body .notion-code {
    padding: 12px 14px; font-size: 13px;
  }
  .article-body .notion-callout {
    padding: 14px 16px; margin: 18px 0; font-size: 14.5px;
  }

  /* 文章 footer */
  .article-foot { padding-top: 24px; margin-top: 32px; max-width: 100%; }
  .article-foot-tags { gap: 6px; margin-bottom: 18px; flex-wrap: wrap; }
  .prev-next { grid-template-columns: 1fr; gap: 10px; margin-top: 18px; }
  .pn-card { padding: 14px 16px; }
  .pn-title { font-size: 14px; }
  .pn-right { text-align: left; }

  /* —— 关于页 —— */
  .about-hero { display: block; padding: 8px 0 32px; }
  .about-hero > .portrait-col { margin-top: 28px; align-items: flex-start; }
  .about-h1 { font-size: 44px; line-height: 1.1; margin: 16px 0 18px; }
  .about-lead { font-size: 17px; max-width: 100%; }
  .portrait { width: 100%; max-width: 280px; height: 240px; }
  .portrait-glyph { font-size: 110px; }
  .portrait-caption { text-align: left; }
  .about-body { font-size: 15.5px; max-width: 100%; margin: 32px auto 0; }
  .about-facts { grid-template-columns: repeat(2, 1fr); margin: 40px 0; }
  .fact { padding: 22px 18px; }
  .fact:nth-child(2) { border-right: 0; }
  .fact:nth-child(1), .fact:nth-child(2) { border-bottom: 1px solid var(--rule); }
  .fact-num { font-size: 30px; }
  .elsewhere { margin: 40px 0; }
  .link-list { grid-template-columns: 1fr; }
  .link-platform { font-size: 16px; }
  .topics-wrap { padding: 36px 0; }
  .topics-grid { grid-template-columns: repeat(2, 1fr); }
  .topic-cell { padding: 16px 14px; min-height: 84px; }
  .topic-name { font-size: 16px; }
  .colophon { padding: 36px 0 16px; margin-top: 24px; }
  .stack-item { padding: 22px 18px; }
  .stack-name { font-size: 22px; }
  .workflow { padding: 18px 20px; }
  .workflow-line { gap: 8px; }
  .wf-step { font-size: 13px; padding: 4px 8px; }

  /* —— 页脚 —— */
  .site-foot {
    flex-direction: column; gap: 8px; margin-top: 56px;
    padding-top: 24px; font-size: 11px; align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .page { padding: 14px 12px 48px; }
  .hero-title { font-size: 28px; }
  .archive-title { font-size: 24px; }
  .about-h1 { font-size: 34px; }
  .feature-title { font-size: 21px; }
  .article-h1 { font-size: 23px; }
  .article-body { font-size: 15px; }
  .article-body .notion-text { font-size: 15px; }
  .article-body h2, .article-body .notion-h1, .article-body .notion-h2 { font-size: 19px; }
  .article-body h3, .article-body .notion-h3 { font-size: 16px; }
  .pn-title { font-size: 13.5px; }
  .about-facts { grid-template-columns: 1fr; }
  .fact { border-right: 0 !important; border-bottom: 1px solid var(--rule); }
  .fact:last-child { border-bottom: 0; }
  .topics-grid { grid-template-columns: 1fr; }
}
`

// CSS 现在通过 pages/_document.js 注入到 <head>，避免 FOUC（首屏闪现 Notion 默认样式）。
// 这里保留 Style 占位组件保持兼容，渲染 null 不重复注入。
export const Style = () => null

export default Style
