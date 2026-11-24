/*
 * 站点搜索面板：博客和 /xiyu999.html 共用。
 * 任何带 data-xn-search 的元素点了就打开；⌘K / Ctrl+K 开关。
 * 文章列表首次打开时从 /api/search-index 取一次（CDN 缓存 10 分钟）。
 * 样式在 /css/site-nav.css 的 .xn-sd-*。
 */
(function () {
  if (window.__xnSearch) return
  window.__xnSearch = true

  var RECENT = 7
  var MAX = 40
  var posts = null
  var loading = null
  var failed = false
  var wrap, input, list
  var items = []
  var sel = 0
  var lastFocus = null

  function esc (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  function mark (title, q) {
    if (!q) return esc(title)
    var i = title.toLowerCase().indexOf(q)
    if (i < 0) return esc(title)
    return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + q.length)) + '</mark>' + esc(title.slice(i + q.length))
  }

  function load () {
    if (posts || loading) return loading
    failed = false
    loading = fetch('/api/search-index', { headers: { accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(function (j) { posts = Array.isArray(j.posts) ? j.posts : []; render() })
      .catch(function () { failed = true; render() })
      .finally(function () { loading = null })
    return loading
  }

  function build () {
    if (wrap) return
    wrap = document.createElement('div')
    wrap.className = 'xn-sd-wrap'
    wrap.hidden = true
    wrap.innerHTML =
      '<div class="xn-sd" role="dialog" aria-modal="true" aria-label="搜索文章">' +
        '<div class="xn-sd-in">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input type="search" role="combobox" aria-expanded="true" aria-controls="xn-sd-list" aria-autocomplete="list" aria-label="搜索文章" placeholder="搜索文章…" autocomplete="off" spellcheck="false" enterkeyhint="go">' +
          '<button type="button" class="xn-sd-close" aria-label="关闭搜索"><span class="xn-sd-esc">Esc</span><span class="xn-sd-cancel">取消</span></button>' +
        '</div>' +
        '<div id="xn-sd-list" class="xn-sd-list" role="listbox" aria-label="搜索结果"></div>' +
        '<div class="xn-sd-foot" aria-hidden="true"><span>↑↓ 移动</span><span>↵ 打开</span><span>Esc 关闭</span></div>' +
      '</div>'
    document.body.appendChild(wrap)
    input = wrap.querySelector('input')
    list = wrap.querySelector('.xn-sd-list')

    input.addEventListener('input', render)
    wrap.querySelector('.xn-sd-close').addEventListener('click', close)
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) close() })
    wrap.addEventListener('keydown', onKey)
    list.addEventListener('click', function (e) {
      var el = e.target.closest('.xn-sd-item')
      if (el) go(items[+el.dataset.i])
    })
    list.addEventListener('mousemove', function (e) {
      var el = e.target.closest('.xn-sd-item')
      if (el && +el.dataset.i !== sel) { sel = +el.dataset.i; update(false) }
    })
  }

  function render () {
    if (!wrap) return
    var q = input.value.trim().toLowerCase()
    items = []
    var html = ''
    if (!posts) {
      list.innerHTML = '<div class="xn-sd-empty">' + (failed ? '文章列表没载入成功，<a href="/search">去搜索页</a>' : '载入中…') + '</div>'
      input.removeAttribute('aria-activedescendant')
      return
    }
    input.placeholder = '搜索 ' + posts.length + ' 篇文章…'
    var hits = !q
      ? posts.slice(0, RECENT)
      : posts.filter(function (p) {
        return [p.t, p.c, (p.g || []).join(' '), p.s].join(' ').toLowerCase().indexOf(q) >= 0
      }).slice(0, MAX)
    hits.forEach(function (p) { items.push({ href: p.h, title: p.t, date: p.d }) })
    if (hits.length) html += '<div class="xn-sd-h" role="presentation">' + (q ? '匹配 ' + hits.length + ' 篇' : '最近发布') + '</div>'
    else if (q) html += '<div class="xn-sd-empty">没有匹配的文章</div>'
    if (q) items.push({ href: '/search?s=' + encodeURIComponent(input.value.trim()), title: '在搜索页查看「' + input.value.trim() + '」的全部结果', date: '↗', raw: true })
    items.forEach(function (it, i) {
      if (it.raw && hits.length) html += '<div class="xn-sd-h" role="presentation">更多</div>'
      html += '<div class="xn-sd-item" role="option" id="xn-o-' + i + '" data-i="' + i + '" aria-selected="false">' +
        '<span class="xn-sd-t">' + (it.raw ? esc(it.title) : mark(it.title, q)) + '</span>' +
        (it.date ? '<span class="xn-sd-d">' + esc(it.date) + '</span>' : '') + '</div>'
    })
    list.innerHTML = html
    sel = 0
    update(true)
  }

  function update (resetScroll) {
    var nodes = list.querySelectorAll('.xn-sd-item')
    nodes.forEach(function (n) { n.setAttribute('aria-selected', String(+n.dataset.i === sel)) })
    var cur = nodes[sel]
    if (cur) {
      input.setAttribute('aria-activedescendant', cur.id)
      if (resetScroll) list.scrollTop = 0
      else cur.scrollIntoView({ block: 'nearest' })
    } else input.removeAttribute('aria-activedescendant')
  }

  function onKey (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return }
    if (e.key === 'Tab') { e.preventDefault(); input.focus(); return }
    if (!items.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % items.length; update(false) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + items.length) % items.length; update(false) }
    else if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); go(items[sel]) }
  }

  function open () {
    build()
    if (!wrap.hidden) return
    lastFocus = document.activeElement
    input.value = ''
    wrap.hidden = false
    document.documentElement.style.overflow = 'hidden'
    render()
    input.focus()
    load()
  }

  function close () {
    if (!wrap || wrap.hidden) return
    wrap.hidden = true
    document.documentElement.style.overflow = ''
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true })
  }

  function go (it) {
    if (!it || !it.href) return
    close()
    var href = it.href
    var router = window.next && window.next.router
    // 博客里走 Next 的客户端路由（不整页刷新）；静态页或站外链接整页跳
    if (router && href.charAt(0) === '/' && !/\.html($|\?)/.test(href)) router.push(href)
    else location.href = href
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-xn-search]')
    if (t) { e.preventDefault(); open() }
  })
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      if (wrap && !wrap.hidden) close(); else open()
    }
  })
  // 鼠标移到搜索按钮上就预取，打开时基本不用等
  document.addEventListener('pointerover', function (e) {
    if (e.target.closest && e.target.closest('[data-xn-search]')) load()
  }, { passive: true })
})()
