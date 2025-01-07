# index.jsx

import './styles.scss'

import CharacterCount from '@tiptap/extension-character-count'
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'

import suggestion from './suggestion.js'

export default () => {
const limit = 280

const editor = useEditor({
extensions: [
Document,
Paragraph,
Text,
CharacterCount.configure({
limit,
}),
Mention.configure({
HTMLAttributes: {
class: 'mention',
},
suggestion,
}),
],
content: `       <p>
        What do you all think about the new <span data-type="mention" data-id="Winona Ryder"></span> movie?
      </p>
    `,
})

const percentage = editor
? Math.round((100 / limit) \* editor.storage.characterCount.characters())
: 0

return (
<>
<EditorContent editor={editor} />
{editor
&& <div className={`character-count ${editor.storage.characterCount.characters() === limit ? 'character-count--warning' : ''}`}>
<svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
          >
<circle
              r="10"
              cx="10"
              cy="10"
              fill="#e9ecef"
            />
<circle
r="5"
cx="10"
cy="10"
fill="transparent"
stroke="currentColor"
strokeWidth="10"
strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
transform="rotate(-90) translate(-20)"
/>
<circle
              r="6"
              cx="10"
              cy="10"
              fill="white"
            />
</svg>

          {editor.storage.characterCount.characters()} / {limit} characters
        </div>
      }
    </>

)
}

### Fin index.jsx

# Mentionlist.jsx

import './MentionList.scss'

import React, {
forwardRef,
useEffect,
useImperativeHandle,
useState,
} from 'react'

export const MentionList = forwardRef((props, ref) => {
const [selectedIndex, setSelectedIndex] = useState(0)

const selectItem = index => {
const item = props.items[index]

    if (item) {
      props.command({ id: item })
    }

}

const upHandler = () => {
setSelectedIndex(((selectedIndex + props.items.length) - 1) % props.items.length)
}

const downHandler = () => {
setSelectedIndex((selectedIndex + 1) % props.items.length)
}

const enterHandler = () => {
selectItem(selectedIndex)
}

useEffect(() => setSelectedIndex(0), [props.items])

useImperativeHandle(ref, () => ({
onKeyDown: ({ event }) => {
if (event.key === 'ArrowUp') {
upHandler()
return true
}

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },

}))

return (

<div className="dropdown-menu">
{props.items.length
? props.items.map((item, index) => (
<button
className={index === selectedIndex ? 'is-selected' : ''}
key={index}
onClick={() => selectItem(index)} >
{item}
</button>
))
: <div className="item">No result</div>
}
</div>
)
})

### Fin Mentionlist.jsx

# suggestion.js

import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import { MentionList } from './MentionList.jsx'

export default {
items: ({ query }) => {
return [
'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
},

render: () => {
let reactRenderer
let popup

    return {
      onStart: props => {

        if (!props.clientRect) {
          return
        }

        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        reactRenderer.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return reactRenderer.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        reactRenderer.destroy()
      },
    }

},
}

### Fin suggestion.js
