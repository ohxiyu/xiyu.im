import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
export const ArticleLock = props => {
  const { validPassword } = props
  const { locale } = useGlobal()

  const submitPassword = () => {
    const p = document.getElementById('password')
    if (!validPassword(p?.value)) {
      const tips = document.getElementById('tips')
      if (tips) {
        tips.innerHTML = ''
        tips.innerHTML = `<div class='text-red-500 animate__shakeX animate__animated'>${locale.COMMON.PASSWORD_ERROR}</div>`
      }
    }
  }

  const passwordInputRef = useRef(null)
  useEffect(() => {
    // 选中密码输入框并将其聚焦
    passwordInputRef.current.focus()
  }, [])

  return <div id='container' className='w-full flex justify-center items-center h-96 '>
        <div className='text-center space-y-3'>
            <div className='font-bold'>{locale.COMMON.ARTICLE_LOCK_TIPS}</div>
            <div className='flex'>
                <input id="password" type='password'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitPassword()
                      }
                    }}
                    ref={passwordInputRef} // 绑定ref到passwordInputRef变量
                    className='outline-none w-full text-sm pl-5 rounded-l transition focus:shadow-lg font-light leading-10 text-black dark:bg-gray-500 bg-gray-50'
                ></input>
                <div onClick={submitPassword} className="px-3 whitespace-nowrap cursor-pointer items-center justify-center py-2 rounded-r duration-300 bg-gray-300" >
                    {/* 内联 SVG 钥匙图标。
                        原先用的是 FontAwesome 的 fa-key——全站仅此一处用到，
                        却要为它加载一个渲染阻塞的 CDN 样式表和 944K 字体文件。 */}
                    <span className='duration-200 cursor-pointer dark:text-black inline-flex items-center gap-1'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none'
                            stroke='currentColor' strokeWidth='2' strokeLinecap='round'
                            strokeLinejoin='round' aria-hidden='true'>
                            <circle cx='7.5' cy='15.5' r='4.5' />
                            <path d='M10.7 12.3 21 2' />
                            <path d='m17 6 3 3' />
                        </svg>
                        {locale.COMMON.SUBMIT}
                    </span>
                </div>
            </div>
            <div id='tips'>
            </div>
        </div>
    </div>
}
