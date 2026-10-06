import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ArticleShare from '@/themes/xiyu/components/ArticleShare'
import PostTags from '@/themes/xiyu/components/PostTags'
import TOC from '@/themes/xiyu/components/TOC'

jest.mock('@/components/SmartLink', () => {
  const React = require('react')
  return function SmartLink({ href, children, ...rest }) {
    return React.createElement('a', { href, ...rest }, children)
  }
})

describe('精简分享：只有复制成功才显示已复制', () => {
  const writeText = jest.fn()
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    writeText.mockReset()
  })
  it('复制当前文章链接，等待浏览器完成后提示成功', async () => {
    writeText.mockResolvedValue(undefined)
    render(<ArticleShare post={{ title: '文章' }} />)
    fireEvent.click(screen.getByRole('button', { name: '复制链接' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('已复制'))
    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })
  it('权限拒绝时提示失败，不误报成功', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    render(<ArticleShare post={{ title: '文章' }} />)
    fireEvent.click(screen.getByRole('button', { name: '复制链接' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('复制失败'))
    expect(screen.getByRole('status')).not.toHaveTextContent('已复制')
  })
  it('外部分享正确编码标题和链接', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null)
    render(<ArticleShare post={{ title: '比特币 & 隐私' }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Telegram' }))
    expect(open).toHaveBeenCalledWith(
      `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('比特币 & 隐私')}`,
      '_blank', 'noopener,noreferrer'
    )
    open.mockRestore()
  })
})

it('收起的标签仍保留全部内容和正确链接', () => {
  const { container } = render(<PostTags tags={['比特币', 'AI Agent', '安全', '开发']} />)
  expect(container.querySelector('details').open).toBe(false)
  expect(container.querySelector('summary')).toHaveAttribute('aria-label', '展开另外 2 个标签')
  expect(container.querySelectorAll('a')).toHaveLength(4)
  expect(screen.getByText('AI Agent')).toHaveAttribute('href', '/tag/AI%20Agent')
  expect(screen.getByText('安全')).toHaveAttribute('href', `/tag/${encodeURIComponent('安全')}`)
})

it('空目录不产生节点；手机目录可展开且保留锚点', () => {
  const { container, rerender } = render(<TOC toc={[]} />)
  expect(container).toBeEmptyDOMElement()
  rerender(<TOC toc={[{ id: 'heading-1', text: '第一节', indentLevel: 0 }]} />)
  const mobile = container.querySelector('.toc-mobile')
  expect(mobile.open).toBe(false)
  expect(mobile.querySelector('a')).toHaveAttribute('href', '#heading-1')
  expect(container.querySelector('.toc-desktop a')).toHaveAttribute('href', '#heading-1')
})
