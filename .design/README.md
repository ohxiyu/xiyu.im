# xiyu.im · NotionNext 主题交接包

给 **Claude Code** / 独立开发者 用的完整实现任务包。交给他（它）后，能产出一套可直接 `cp -r` 到你 NotionNext fork 的 `themes/xiyu/` 目录。

---

## 🚀 给 Claude Code 的使用方法

```bash
# 1. 在你 fork 的 NotionNext 仓库根目录打开 Claude Code
cd ~/code/your-notionnext-fork
claude

# 2. 在对话里把这个 handoff 目录整个扔进去
> 请读取 ./handoff/CLAUDE.md，按里面的任务书实现 xiyu 主题。
> 实现位置：themes/xiyu/
> 完成后告诉我验收清单的每一项是否通过。
```

Claude Code 会自动读 `CLAUDE.md` 里的详细任务书 → 读设计稿和源码 → 写代码 → 自测 → 汇报。

---

## 📦 目录说明

| 路径 | 用途 |
|---|---|
| `CLAUDE.md` | **给 AI 的任务书** · Claude Code 优先读这份 |
| `INTEGRATION.md` | 更详细的集成指南（代码示例更全） |
| `mockups/xiyu.im.html` | 设计稿 · 所有页面最终效果（视觉契约） |
| `mockups/Logo Final.html` | Logo + favicon 最终落地预览 |
| `source/*.css`, `source/*.jsx` | 设计稿的 CSS 与 React 源码（直接搬进主题） |
| `brand-assets/` | Logo / favicon / OG 图 / manifest（放到 `public/`） |

---

## 🧭 人类操作流程

1. **这个 handoff 包** 整个扔给 Claude Code（或者你自己手动照 `CLAUDE.md` 做）
2. 它会在 `themes/xiyu/` 下产出完整主题代码
3. 把 `handoff/brand-assets/` 下的文件按 `brand-assets/README.md` 第 1 步拷到 `public/`
4. 改 `blog.config.js`：
   - `THEME: 'xiyu'`
   - `BLOG_FAVICON: '/favicon.svg'` 等（`brand-assets/README.md` 有完整配置）
5. Notion 数据库加 property：`num` / `summary` / `flag`（见 `CLAUDE.md`）
6. `yarn dev` 本地跑起来
7. `git push` → Vercel 自动部署

---

## ⏱ 预估

- Claude Code 自动实现：**2–4 小时**（含自测）
- 人工 review + 微调：**1–2 小时**
- Notion 数据库字段补齐：**15 分钟**

---

## 🆘 碰到问题

把 Claude Code 的报错 / 截图发给我，我来帮你定位是：
- 设计稿的问题（我改 mockup）
- 集成的问题（我改 CLAUDE.md / INTEGRATION.md）
- NotionNext 自身的问题（告诉你怎么绕）
