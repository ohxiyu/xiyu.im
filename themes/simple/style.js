/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
  /* 底色 */
  .dark body{
      background-color: black;
  }
  /* 文本不可选取 */
    .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
  

  /* simple主题正文宽度（支持Notion配置覆盖） */
  #theme-simple {
    --notion-max-width: var(--simple-notion-max-width, 960px);
  }

  @media (min-width: 1536px) {
    #theme-simple {
      --notion-max-width: var(--simple-notion-max-width-2xl, 1120px);
    }
  }

  #theme-simple .simple-main-container {
    max-width: var(--simple-container-max-width, 95vw);
    padding-left: 1rem;
    padding-right: 1rem;
  }

  #theme-simple .simple-article-container {
    max-width: var(--simple-article-max-width, 1200px);
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1280px) {
    #theme-simple .simple-main-container {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  @media (min-width: 1536px) {
    #theme-simple .simple-main-container {
      max-width: var(--simple-container-max-width-2xl, 1900px);
    }
    #theme-simple .simple-article-container {
      max-width: var(--simple-article-max-width-2xl, 1700px);
    }
  }

  #theme-simple #announcement-content {
    /* background-color: #f6f6f6; */
  }
  
  #theme-simple .blog-item-title {
    color: #276077;
  }
  
  .dark #theme-simple .blog-item-title {
    color: #d1d5db;
  }
  
  .notion {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  
  
  /*  菜单下划线动画 */
  #theme-simple .menu-link {
      text-decoration: none;
      background-image: linear-gradient(#dd3333, #dd3333);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: 0 2px;
      transition: background-size 100ms ease-in-out;
  }
   
  #theme-simple .menu-link:hover {
      background-size: 100% 2px;
      color: #dd3333;
      cursor: pointer;
  }
  
  

  `}</style>
}

export { Style }
