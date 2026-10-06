# Task: Beautiful UI 全站交互预览

```yaml
id: 2026-10-06-beautiful-ui-refresh
type: development
goal: 细化首页，并统一文章、归档、搜索、关于、分类标签和说明页的视觉
priority: P1
inputs:
  - 用户要求全站调整，参考 beautifului.dev，简洁、现代、信息密度适中
  - origin/main 4e02ea04
deliverables:
  - themes/xiyu/
  - public/css/xiyu.css
  - components/ui/CommandDialog.js
  - components/ui/MobileNavDrawer.js
  - __tests__/themes/
  - AGENTS.md
acceptance:
  - 使用真实 Notion 内容的 Vercel Preview，可逐页访问
  - 桌面与手机、浅色与深色，无页面横向溢出
  - 搜索、目录、分页、分享和导航可操作
  - 关于单栏无装饰线，文章保留显式两栏防线
  - 单元测试、lint、类型检查和构建通过
limits:
  max_turns: 4
  max_retries: 3
  max_duration_minutes: 90
  max_cost_yuan: 0
  scope: 只创建分支和 PR Preview；全站方案待视觉验收后合并
blocked_format:
  reason:
  required_input:
  retry_scope:
```
