import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

import preset from '@bbob/preset-html5'
import html from '@bbob/html'
import { NodeContent } from '@bbob/types'

const myPreset = preset.extend(defTags => ({
  ...defTags,
  // bbcode tags always lowercased
  // <span class="my-tag"><span class="avatar"/> <slot></slot></span>
  avatar: (node) => {
    const avatarNode = {
      tag: 'span',
      attrs: {
        class: 'avatar',
      },
      content: [],
    }

    const content: NodeContent[] = []
    const nodeContent = node.content || ''

    return ({
      ...node,
      tag: 'span',
      attrs: {
        class: 'my-tag',
      },
      content: content.concat(avatarNode, nodeContent),
    })
  }
}))

const bbcode = 'Text [b]bolded[/b] and [avatar]Some Name[/avatar]'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <div class="data">
      <div class="bbcode">
        <h2>Raw BB Code here</h2>
        <textarea name="bbcode" id="bbcode" cols="30" rows="10" id="bbcode">${bbcode}</textarea>
      </div>
      <div class="html">
        <h2>Generated HTML here</h2>
        <div id="result"></div>
      </div>
    </div>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  const bbcode: HTMLTextAreaElement | null = document.getElementById('bbcode') as HTMLTextAreaElement
  const result = document.getElementById('result')

  if (bbcode && result) {
    const plugins = [
      myPreset()
    ]

    const render = (input: string) => html(input, plugins)

    bbcode.addEventListener('input', (e) => {
      const target = e?.target as HTMLInputElement

      result.innerHTML = render(target?.value)
    })

    result.innerHTML = render(bbcode?.value)
  }
})
