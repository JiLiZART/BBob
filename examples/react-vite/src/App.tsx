import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import preset from '@bbob/preset-react'
import BBCode from '@bbob/react'
import Avatar from "./components/Avatar";

const myPreset = preset.extend(defTags => ({
  ...defTags,
  // bbcode tags always lowercased
  avatar: (node) => ({
    ...node,
    tag: Avatar,
  })
}))

const plugins = [
  myPreset()
]

function App() {
  const [bbcode, setBBCode] = useState('Text [b]bolded[/b] and [avatar]Some Name[/avatar]')

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBBCode(e.target.value)
  }

  return (
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo"/>
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo"/>
          </a>
        </div>
        <div className="data">
          <div className="bbcode">
            <h2>Raw BB Code here</h2>
            <textarea name="bbcode" id="bbcode" cols={30} rows={10} onInput={onInput} defaultValue={bbcode} />
          </div>
          <div className="html">
            <h2>Generated HTML here</h2>
            <BBCode plugins={plugins}>{bbcode}</BBCode>
          </div>
        </div>
      </>
  )
}

export default App
