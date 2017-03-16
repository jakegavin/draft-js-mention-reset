import React, { Component } from "react"
import {fromJS} from "immutable"
import Editor from "draft-js-plugins-editor"
import {EditorState} from "draft-js"
import createMentionPlugin, {defaultSuggestionsFilter} from "draft-js-mention-plugin"
import "draft-js-mention-plugin/lib/plugin.css"

const mentionPlugin = createMentionPlugin()
const {MentionSuggestions} = mentionPlugin
const plugins = [mentionPlugin]

const mentions = fromJS([
  {
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
    avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
  },
])

const styles = {
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    width: 600,
    padding: 10,
  },
}

export default class MentionInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: fromJS([]),
    }
  }

  handleChange(editorState) {
    this.setState({editorState: editorState})
  }

  handleSearchChange(search) {
    const value = search.value
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  render() {
    return (
      <div style={styles.editor} onClick={() => this.editor.focus()}>
        <Editor
          editorState={this.state.editorState}
          onChange={(state) => this.handleChange(state)}
          plugins={plugins}
          ref={(e) => this.editor = e}
        />
        <MentionSuggestions
          onSearchChange={(e) => this.handleSearchChange(e)}
          suggestions={this.state.suggestions}
        />
      </div>
    )
  }
}
