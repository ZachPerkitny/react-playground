import shortid from 'shortid'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import EditorDirectoryTree from './EditorDirectoryTree'
import EditorTabs from './EditorTabs'
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

  constructor(props) {
    super(props)
    const indexNode = createNewNode()
    const rootNode = createNewNode({
      childNodes: [indexNode,],
    })
    this.state = {
      creatingNodeType: null,
      nodeData: {
        [rootNode.id]: {
          name: 'root',
          toggled: true,
        },
        [indexNode.id]: {
          name: 'index.js',
          content: '',
        },
      },
      rootNode,
      selectedNodeId: indexNode.id,
      tabs: [indexNode.id],
      selectedTab: indexNode.id,
      title: '',
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleDocumentKeydown)
  }

  handleCodeChange = (value) => {
    this.setState({
      nodeData: {
        ...this.state.nodeData,
        [this.state.selectedTab]: {
          ...this.state.nodeData[this.state.selectedTab],
          content: value,
        }
      }
    })
  }

  handleCloseTab = (nodeId) => {
    const {
      selectedTab,
      tabs
    } = this.state
    const i = tabs.indexOf(nodeId)
    const newTabs = [
      ...tabs.slice(0, i),
      ...tabs.slice(i + 1),
    ]
    this.setState({ tabs: newTabs })
    if (nodeId === selectedTab) {
      this.setState({
        selectedNodeId: newTabs[0],
        selectedTab: newTabs[0],
      })
    }
  }

  handleSelectTab = (nodeId) => {
    this.setState({
      selectedNodeId: nodeId,
      selectedTab: nodeId
    })
  }

  getNodeName = (node) => {
    const { nodeData } = this.state
    return nodeData[(typeof node === 'string') ? node : node.id].name
  }

  isNodeToggled = (node) => {
    const { nodeData } = this.state
    return nodeData[(typeof node === 'string') ? node : node.id].toggled
  }

  handleChangeTitle = (value) => {
    this.setState({ title: value })
  }

  handleDocumentKeydown = (e) => {
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

  handleClickRun = () => {
    this.props.onRun(this.state.code)
  }

  handleClickSave = () => {
    this.props.onSave({
      code: this.state.code,
      title: this.state.title,
    })
  }

  handleNodeClick = (node, path) => {
    if (node.childNodes) {
      const { nodeData } = this.state
      this.setState({
        nodeData: {
          ...nodeData,
          [node.id]: {
            ...nodeData[node.id],
            toggled: !nodeData[node.id].toggled,
          }
        }
      })
    } else {
      const {
        tabs,
        selectedTab,
      } = this.state

      if (tabs.indexOf(node.id) === -1) {
        this.setState({ tabs: [...tabs, node.id] })
      }

      if (selectedTab !== node.id) {
        this.setState({ selectedTab: node.id })
      }
    }
    this.setState({ selectedNodeId: node.id })
  }

  handleNodeDelete = (node, path) => {
    this.updateNodeAtPath(path, null)
  }

  handleNewNodeStart = (parentNode, path, type) => {
    const { nodeData } = this.state
    this.setState({
      creatingNodeType: type,
      nodeData: {
        ...nodeData,
        [parentNode.id]: {
          ...nodeData[parentNode.id],
          toggled: true,
        },
      },
      selectedNodeId: parentNode.id,
    })
  }

  handleNewNodeEnd = (parentNode, path, type, name) => {
    if (!name) {
      this.setState({
        creatingNodeType: null,
      })
      return
    }

    const { creatingNodeType, } = this.state
    let newNode
    if (creatingNodeType === 'folder') {
      newNode = createNewNode({
        childNodes: [],
      })
    } else {
      newNode = createNewNode()
    }

    this.insertNodeAtPath(path, newNode, { name })
    this.setState({ creatingNodeType: null, })
  }

  handleNodeRename = (node, path, newName) => {
    this.setState({
      nodeData: {
        ...this.state.nodeData,
        [node.id]: {
          ...this.state.nodeData[node.id],
          name: newName,
        }
      }
    })
  }

  insertNodeAtPath = (path, newNode, newNodeData) => {
    const {
      nodeData,
      rootNode,
    } = this.state

    const insert = (node, pathIndex) => {
      if (pathIndex === path.length) {
        return {
          ...node,
          childNodes: [
            ...node.childNodes,
            (typeof newNode === 'function') ?
              newNode(node) : newNode,
          ]
        }
      }
      const name = path[pathIndex]
      for (let i = 0; i < node.childNodes.length; i++) {
        if (this.getNodeName(node.childNodes[i]) === name) {
          return {
            ...node,
            childNodes: [
              ...node.childNodes.slice(0, i),
              insert(node.childNodes[i], pathIndex + 1),
              ...node.childNodes.slice(i + 1)
            ],
          }
        }
      }
    }

    this.setState({
      nodeData: {
        ...nodeData,
        [newNode.id]: {
          ...newNodeData
        },
      },
      rootNode: insert(rootNode, 0),
    })
  }

  updateNodeAtPath = (path, newNode) => {
    const {
      nodeData,
      rootNode,
    } = this.state
    const removedNodes = []

    const update = (node, pathIndex) => {
      if (pathIndex === path.length) {
        return (typeof newNode === 'function') ?
          newNode(node) : newNode
      }
      const name = path[pathIndex]
      for (let i = 0; i < node.childNodes.length; i++) {
        if (this.getNodeName(node.childNodes[i]) === name) {
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
            removedNodes.push(res)
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

    const newRootNode = update(rootNode, 0)
    if (removedNodes.length) {
      const newNodeData = Object.keys(nodeData).reduce((object, key) => {
        if (removedNodes.indexOf(key) === -1) {
          object[key] = nodeData[key]
        }
        return object
      }, {})
      this.setState({ nodeData: newNodeData })
    }
    this.setState({ rootNode: newRootNode })
  }

  render() {
    const {
      creatingNodeType,
      nodeData,
      rootNode,
      selectedNodeId,
      selectedTab,
      tabs,
      title,
    } = this.state
    return (
      <Box
        display="flex"
        flexDirection="column" 
        flexGrow={1}
      >
        <EditorToolbar
          onClickRun={this.handleClickRun}
          onClickSave={this.handleClickSave}
          onChangeTitle={this.handleChangeTitle}
          title={title}
        />
        <Box
          display="flex"
          flexGrow={1}
        >
          <EditorDirectoryTree
            creatingNodeType={creatingNodeType}
            rootNode={rootNode}
            selectedNodeId={selectedNodeId}
            getName={this.getNodeName}
            isToggled={this.isNodeToggled}
            onClick={this.handleNodeClick}
            onNewNodeStart={this.handleNewNodeStart}
            onNewNodeEnd={this.handleNewNodeEnd}
            onDelete={this.handleNodeDelete}
            onRename={this.handleNodeRename}
          />
          <EditorTabs
            code={nodeData[selectedTab].content}
            tabs={tabs}
            selectedTab={selectedTab}
            getName={this.getNodeName}
            onCodeChange={this.handleCodeChange}
            onCloseTab={this.handleCloseTab}
            onSelectTab={this.handleSelectTab}
          />
        </Box>
      </Box>
    )
  }
}

export default Editor
