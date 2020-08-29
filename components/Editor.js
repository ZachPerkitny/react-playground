import React, { Component } from 'react'
import AceEditor from 'react-ace'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import EditorDirectoryTree from './EditorDirectoryTree'
import EditorToolbar from './EditorToolbar'

class Editor extends Component {
  static propTypes = {
    onRun: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  state = {
    code: '',
    rootDirectory: {
      directories: [
        { name: 'test', files: [{name: 'styles.css', content: ''}] }
      ],
      files: [
        { name: 'index.js', content: '' }
      ],
    },
    title: '',
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.onKeydown)
  }

  onChangeCode = (value) => {
    this.setState({
      code: value
    })
  }

  onChangeTitle = (e) => {
    this.setState({
      title: e.target.value,
    })
  }

  onLoad = (editor) => {
    editor.renderer.setPadding(5)
  }

  onKeydown = (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      e.preventDefault()
      this.props.onRun(this.state.code)
    } else if (e.keyCode === 83 && e.ctrlKey) {
      e.preventDefault()
      this.props.onSave({
        code: this.state.code,
        title: this.state.title,
      })
    }
  }

  onRun = () => {
    this.props.onRun(this.state.code)
  }

  onSave = () => {
    this.props.onSave({
      code: this.state.code,
      title: this.state.title,
    })
  }

  onFileSelect = (val) => {
    console.log(val)
  }

  render() {
    return (
      <Box
        display="flex"
        flexDirection="column" 
        flexGrow={1}
      >
        <EditorToolbar
          onClickRun={this.onRun}
          onClickSave={this.onSave}
          onChangeTitle={this.onChangeTitle}
          title={this.state.title}
        />
        <Box
          display="flex"
          flexGrow={1}
        >
          <EditorDirectoryTree
            rootDirectory={this.state.rootDirectory}
            onFileSelect={this.onFileSelect}
          />
          <AceEditor
            onChange={this.onChangeCode}
            onLoad={this.onLoad}
            mode="javascript"
            value={this.state.code}
            width="50%"
            height="auto"
            style={{ flexGrow: 1 }}
          />
        </Box>
      </Box>
    )
  }
}

export default Editor
