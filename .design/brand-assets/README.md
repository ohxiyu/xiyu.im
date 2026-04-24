# xiyu.im · Logo & Brand Assets

**方向 01 · Portrait** · 头像式具象 mark
品牌色：`#FFC828`（黄）· `#0F0D0A`（墨）· `#E67E22`（橙点缀）

---

## 📦 文件清单

### 矢量（优先使用）

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `logo-mark.svg` | vector | **主 mark**，纸底/通用 |
| `logo-mark-yellow.svg` | vector | 黄底版（品牌色背景） |
| `logo-mark-dark.svg` | vector | 深色模式反色版 |
| `logo-lockup.svg` | 520×200 | mark + 宋体字标 + "long · bitcoin" 副标 |
| `favicon.svg` | 32×32 | 现代浏览器 favicon（简化版） |

### 位图

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `favicon-16.png` | 16×16 | 老浏览器 tab |
| `favicon-32.png` | 32×32 | 标签页主尺寸 |
| `apple-touch-icon.png` | 180×180 | iOS 主屏图标 |
| `maskable-512.png` | 512×512 | PWA / Android 可 mask 图标 |
| `logo-256.png` | 256×256 | 通用头像（黄底） |
| `logo-dark-256.png` | 256×256 | 通用头像（深色） |
| `og-image.png` | 1200×630 | 社交分享卡 |

---

## 🛠 接入到 NotionNext 主题

### 1. 拷贝文件到 `public/`

```bash
# 在你 fork 的 NotionNext 仓库根目录
mkdir -p public/images/logo

# 通用资源放 images/logo/
cp theme-assets/logo-mark.svg           public/images/logo/
cp theme-assets/logo-mark-yellow.svg    public/images/logo/
cp theme-assets/logo-mark-dark.svg      public/images/logo/
cp theme-assets/logo-lockup.svg         public/images/logo/
cp theme-assets/logo-256.png            public/images/logo/
cp theme-assets/logo-dark-256.png       public/images/logo/
cp theme-assets/og-image.png            public/images/logo/

# favicon 族放 public 根目录（路径必须 /xxx）
cp theme-assets/favicon.svg             public/favicon.svg
cp theme-assets/favicon-16.png          public/favicon-16.png
cp theme-assets/favicon-32.png          public/favicon-32.png
cp theme-assets/apple-touch-icon.png    public/apple-touch-icon.png
cp theme-assets/maskable-512.png        public/maskable-512.png
```

### 2. 改 `blog.config.js`

```js
module.exports = {
  // ... 原有配置
  BLOG_FAVICON:      '/favicon.svg',
  BLOG_AVATAR:       '/images/logo/logo-256.png',
  BLOG_LOGO:         '/images/logo/logo-mark.svg',
  BLOG_LOGO_DARK:    '/images/logo/logo-mark-dark.svg',
  SEO_DEFAULT_IMAGE: '/images/logo/og-image.png',
  HOME_BANNER_IMAGE: '/images/logo/logo-lockup.svg',
}
```

### 3. 注入完整 favicon 族

在 `pages/_document.js` 的 `<Head>` 里加：

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="mask-icon" href="/favicon.svg" color="#ffc828" />
<meta name="theme-color" content="#ffc828" />
<meta name="apple-mobile-web-app-title" content="xiyu" />
```

（或直接使用本包内的 `head-snippet.html`，复制整段进去即可）

### 4. 替换导航栏 brand 块

在主题的 `components/SiteNav.js`（或类似文件）里：

```jsx
import Image from 'next/image'

<a href="/" className="brand">
  <Image
    src="/images/logo/logo-mark.svg"
    width={36}
    height={36}
    alt="xiyu"
    priority
  />
  <span className="brand-mark">
    xiyu<span className="brand-dot" />
  </span>
  <span className="brand-tag">long · bitcoin</span>
</a>
```

### 5. （可选）PWA manifest

在 `public/manifest.json` 里引用：

```json
{
  "name": "xiyu's Blog",
  "short_name": "xiyu",
  "icons": [
    { "src": "/favicon-32.png",       "sizes": "32x32",   "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/maskable-512.png",     "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#ffc828",
  "background_color": "#faf7f2",
  "display": "standalone"
}
```

### 6. 同步到 Notion

登录 Notion，把"关于"页头像 block 也换成 `logo-256.png` —— 这样博客、Notion 数据源、分享卡三处视觉一致。

---

## ✅ 验收清单

- [ ] 浏览器 tab · 16px 下 mark 依然能辨认
- [ ] iOS "添加到主屏" · 黄底圆角无白边
- [ ] 深色模式导航栏 · 自动切到反色版
- [ ] Twitter / 微信 / Telegram 分享 · og-image 正确显示
- [ ] PWA 安装 · 图标无裁切

---

## 🎨 色彩参考

```
--yellow      #ffc828   品牌主色（发卡 / 按钮 / 背景块）
--ink         #0f0d0a   主文字与 mark 填充
--accent      #e67e22   bitcoin 橙，重点点缀（不超过 10% 面积）
--paper       #faf7f2   温纸米底
--rule        #e8e1d3   分割线
--mute        #6b6358   辅助文字
```

## 🔤 字体

- **标题**：`Noto Serif SC` / `Source Han Serif SC` / `Songti SC`（宋体）
- **正文**：`Noto Sans SC` / `PingFang SC`
- **数字/日期/代码**：`JetBrains Mono`（tabular-nums）

用 Google Fonts 引入：
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600&family=Noto+Sans+SC:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
