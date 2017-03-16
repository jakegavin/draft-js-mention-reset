import React, { Component } from 'react';
import MentionInput from "./MentionInput"

class App extends Component {
  render() {
    return (
      <div>
        <h1>Mention Plugin: Multiple Inputs Issue</h1>
        <h3>Input 1</h3>
        <MentionInput />
        <h3>Input 2</h3>
        <MentionInput />
      </div>
    );
  }
}

export default App;
