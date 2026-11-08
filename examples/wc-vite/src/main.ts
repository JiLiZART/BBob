import './style.css'
import '@bbob/wc'
import viteLogo from '/vite.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <h1>BBob + Web Components</h1>
    <div class="card">
      <bb-code html5>Text [b]bolded[/b] and [i]italic[/i] and [url=https://github.com/JiLiZART/bbob]link[/url]</bb-code>
    </div>
  </div>
`
