import shortid from 'shortid'
import React, { Component } from 'react'
import AceEditor from 'react-ace'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import EditorDirectoryTree from './EditorDirectoryTree'
import EditorToolbar from './EditorToolbar'

const createNewNode = ({
  ...properties
}) => {
  return {
    id: shortid(),
    ...properties,
  }
}

class Editor extends Component {
  static propTypes = {
    onRun: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  state = {
    code: '',
    rootNode: createNewNode({
      childNodes: [
        createNewNode({
          name: 'test',
          childNodes: [
            createNewNode({
              name: 'styles.css',
              content: ''
            })
          ]
        }),
        createNewNode({
          name: 'index.js',
          content: ''
        }),
      ]
    }),
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

  onNodeDelete = (node, path) => {
    this.updateTree(path, null)
  }

  onNodeRename = (node, path, newName) => {
    this.updateTree(path, {
      ...node,
      name: newName,
    })
  }

  updateTree = (path, newNode) => {
    const update = (node, pathIndex) => {
      if (pathIndex === path.length) {
        return newNode
      }
      const name = path[pathIndex]
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].name === name) {
          const res = update(node.childNodes[i], pathIndex + 1)
          if (res) {
            return {
              ...node,
              childNodes: [
                ...node.childNodes.slice(0, i),
                res,
                ...node.childNodes.slice(i + 1)
              ],
            }
          } else {
            return {
              ...node,
              childNodes: [
                ...node.childNodes.slice(0, i),
                ...node.childNodes.slice(i + 1)
              ],
            }
          }
        }
      }
    }

    this.setState({
      rootNode: update(this.state.rootNode, 0),
    })
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
            rootNode={this.state.rootNode}
            onDelete={this.onNodeDelete}
            onRename={this.onNodeRename}
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
