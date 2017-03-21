import React, { Component } from "react"
import {fromJS} from "immutable"
import Editor from "draft-js-plugins-editor"
import {EditorState} from "draft-js"
import createMentionPlugin, {defaultSuggestionsFilter} from "draft-js-mention-plugin"
import "draft-js-mention-plugin/lib/plugin.css"


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

    this._mentionPlugin = createMentionPlugin()
    this.state = {
      isSuggestionOpen: false,
      editorState: EditorState.createEmpty(),
      suggestions: fromJS([]),
    }
  }

  handleChange(editorState) {
    this.setState({editorState: editorState})
  }

  handleReturn(event) {
    const isShift = !!event.shiftKey
    if (!isShift && !this.state.isSuggestionOpen) {
      // Post to server
      this.resetCommentInput()
      return "handled"
    } else {
      return "not-handled"
    }
  }

  resetCommentInput() {
    this._mentionPlugin = createMentionPlugin()
    // EditorState.createEmpty makes no assumptions about whether or not the generated SelectionState has focus.
    // It creates a non-focused SelectionState so use moveFocusToEnd to handle the focused state.
    this.setState({
      isSuggestionOpen: false,
      editorState: EditorState.moveFocusToEnd(EditorState.createEmpty()),
      suggestions: fromJS([]),
    })
  }

  handleSearchChange(search) {
    const value = search.value
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  handleSuggestionClose() {
    this.setState({
      isSuggestionOpen: false,
      suggestions: fromJS([]),
    })
  }

  handleSuggestionOpen() {
    this.setState({isSuggestionOpen: true})
  }

  render() {
    const {MentionSuggestions} = this._mentionPlugin
    const plugins = [this._mentionPlugin]
    return (
      <div style={styles.editor} onClick={() => this.editor.focus()}>
        <Editor
          editorState={this.state.editorState}
          onChange={(state) => this.handleChange(state)}
          handleReturn={(ev) => this.handleReturn(ev)}
          plugins={plugins}
          ref={(e) => this.editor = e}
        />
        <MentionSuggestions
          onClose={() => this.handleSuggestionClose()}
          onOpen={() => this.handleSuggestionOpen()}
          onSearchChange={(e) => this.handleSearchChange(e)}
          suggestions={this.state.suggestions}
        />
      </div>
    )
  }
}
