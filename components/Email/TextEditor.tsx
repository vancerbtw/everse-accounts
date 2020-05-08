import React from "react";

class TextEditor extends React.Component<any, {
  editorValue: string
}> {
  private quill: any;

  constructor(props: any) {
    super(props);
    if (document) {
      this.quill = require('react-quill')
    }

    this.state = {
      editorValue: ""
    }
  }

  render() {
    const Quill = this.quill

    if (Quill) {
      return (
        <div className="email-text-editor-wrapper">
          <Quill theme="snow" value={this.state.editorValue} onChange={(editorValue: string) => this.setState({ editorValue })}/>
        </div>
      );
    } else {
      return <></>
    }
  }  
}

export default TextEditor;