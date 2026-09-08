const fs = require('fs')
const path = require('path')

/**
 * 回归测试：文章详情页的网格布局不能依赖「DOM 里现在有几个子元素」。
 *
 * 背景 bug：<TOC toc={post.toc} /> 在 post.toc 为空数组时 return null，
 * React 不会为它渲染任何 DOM 节点。当时 .article-layout 是三栏、
 * 三个子元素平铺，又没给它们显式声明 grid-column，于是 CSS Grid 的隐式
 * 自动布局会按“现存子元素数量”重新分配轨道：<article> 被挤进本该给 TOC 的
 * 窄列，<ArticleSide> 顶替进本该给正文的宽列——表现为标题被压成一条窄条
 * 疯狂换行、右侧一大片空白。触发条件是“文章没有二级标题”，不是“文章年代久远”。
 *
 * 布局后来改成两栏（目录和阅读信息合并到左侧一根轨里），根因的防线也随之变了，
 * 现在有两层：
 *
 *   1. 结构上：TOC 被包在 .article-rail 里，grid 的直接子元素恒为
 *      .article-rail + <article> 两个，TOC 返回 null 也改变不了这个数量。
 *      这是最强的一层，所以下面对 JSX 也做断言。
 *   2. 样式上：两个子元素仍各自显式声明 grid-column。
 *
 * 两层都钉住，免得以后有人把 TOC 从 rail 里挪出来、或者删掉 grid-column
 * 时同一个 bug 复活。
 */
describe('article-layout 网格：TOC 为空时不应导致正文错位', () => {
  const cssPath = path.resolve(__dirname, '../../public/css/xiyu.css')
  const css = fs.readFileSync(cssPath, 'utf8')
  const themePath = path.resolve(__dirname, '../../themes/xiyu/index.js')
  const themeSrc = fs.readFileSync(themePath, 'utf8')

  // 去掉注释，避免注释里出现的示例代码干扰正则匹配
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')

  function ruleBodyFor(selector) {
    // 找到「选择器 { ... }」中第一个匹配的规则体（不跨选择器边界）
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(escaped + '\\s*{([^}]*)}')
    const m = clean.match(re)
    return m ? m[1] : null
  }

  test('.article-layout 是两栏 grid：左轨定宽 + 正文 1fr', () => {
    const body = ruleBodyFor('.article-layout')
    expect(body).not.toBeNull()
    expect(body).toMatch(/display:\s*grid/)
    expect(body).toMatch(/grid-template-columns:\s*\d+px\s+minmax\(0,\s*1fr\)/)
  })

  test('.article-rail 显式声明为第一列', () => {
    const body = ruleBodyFor('.article-rail')
    expect(body).not.toBeNull()
    expect(body).toMatch(/grid-column:\s*1\b/)
  })

  test('article-layout 内的 <article> 显式声明为第二列（不依赖 DOM 顺序推断）', () => {
    const body = ruleBodyFor('.article-layout > article')
    expect(body).not.toBeNull()
    expect(body).toMatch(/grid-column:\s*2\b/)
  })

  test('TOC 包在 .article-rail 里，grid 的直接子元素数量不随 TOC 有无变化', () => {
    // 抓出 .article-rail 这个 div 的开标签到闭合之间的内容
    const rail = themeSrc.match(/className='article-rail'>([\s\S]*?)<\/div>/)
    expect(rail).not.toBeNull()
    expect(rail[1]).toMatch(/<TOC\b/)
    // TOC 不能同时以 .article-layout 直接子元素的身份出现在 rail 之外
    const layout = themeSrc.match(/className='article-layout'>([\s\S]*?)\n {4}<\/div>/)
    expect(layout).not.toBeNull()
    const outsideRail = layout[1].replace(/className='article-rail'>[\s\S]*?<\/div>/, '')
    expect(outsideRail).not.toMatch(/<TOC\b/)
  })

  test('CSS 文件括号配对平衡（本次编辑未破坏文件结构）', () => {
    const open = (clean.match(/{/g) || []).length
    const close = (clean.match(/}/g) || []).length
    expect(open).toBe(close)
  })
})
