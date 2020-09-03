import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

class NodeNameForm extends Component {
  static defaultProps = {
    initialText: '',
  }

  static propTypes = {
    initialText: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      modifiedText: props.initialText,
    }
    this.ref = createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = ({ target }) => {
    if (this.ref && !this.ref.current.contains(target)) {
      this.setState({
        isEditing: false,
      })
      this.props.onSubmit(this.state.modifiedText)
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    this.props.onSubmit(this.state.modifiedText)
  }

  handleNameKeyDown = ({ keyCode }) => {
    if (keyCode === 27) {
      this.props.onCancel()
    }
  }

  handleNameChange = (e) => {
    this.setState({ modifiedText: e.target.value })
  }

  render() {
    const { modifiedText } = this.state
    return (
      <form ref={this.ref} onSubmit={this.handleFormSubmit}>
        <TextField
          autoFocus={true}
          onChange={this.handleNameChange}
          onKeyDown={this.handleNameKeyDown}
          value={modifiedText}
        />
      </form>
    )
  }
}

export default NodeNameForm
