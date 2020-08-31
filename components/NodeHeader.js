import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const styles = theme => ({
  root: {
    height: '44px',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    paddingLeft: props => theme.spacing(2) * props.depth,
    paddingRight: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: 'pointer',
    flexGrow: 1,
  },
  text: {
    marginLeft: theme.spacing(1),
    userSelect: 'none',
  },
  form: {
    display: 'inline-block',
  },
  textField: {
    marginLeft: theme.spacing(1),
  },
  deleteText: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.error.main,
  }
})

class NodeHeader extends Component {
  static propTypes = {
    depth: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
  } 

  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      isEditing: false,
      modifiedText: props.text,
    }
    this.ref = createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClickOutside)
  }

  onClickOutside = ({ target }) => {
    if (this.state.isEditing && this.ref && !this.ref.current.contains(target)) {
      this.setState({
        isEditing: false,
      })
      this.props.onRename(this.state.modifiedText)
    }
  }

  onClickContainer = (e) => {
    if (this.props.onClick) this.props.onClick()
  }

  onChangeRenameText = (e) => {
    this.setState({
      modifiedText: e.target.value,
    })
  }

  onKeyDownRenameText = ({ keyCode }) => {
    if (keyCode === 27) {
      this.setState({
        isEditing: false,
      })
    }
  }

  onRenameFormSubmit = (e) => {
    e.preventDefault()
    this.setState({
      isEditing: false,
    })
    this.props.onRename(this.state.modifiedText)
  }

  onOpenMenu = (e) => {
    e.stopPropagation()
    this.setState({
      anchorEl: e.target,
    })
  }

  onCloseMenu = (e) => {
    e.stopPropagation()
    this.setState({
      anchorEl: null,
    })
  }

  onSelectRename = (e) => {
    e.stopPropagation()
    this.setState({
      anchorEl: null,
      isEditing: true,
      modifiedText: this.props.text,
    })
  }

  onSelectDelete = (e) => {
    e.stopPropagation()
    this.setState({ anchorEl: null })
    this.props.onDelete()
  }

  render() {
    const {
      classes,
      icon,
      text
    } = this.props
    const {
      anchorEl,
      isEditing,
      modifiedText
    } = this.state
    return (
      <Box
        className={classes.root}
        display="flex"
        justifyContent="space-between"
        onClick={this.onClickContainer}
        ref={this.ref}
      >
        <Box display="flex" alignItems="center">
          {icon}
          {(isEditing) ? (
          <form onSubmit={this.onRenameFormSubmit} className={classes.form}>
            <TextField
              autoFocus="true"
              className={classes.textField}
              onClick={(e) => e.stopPropagation()}
              onChange={this.onChangeRenameText}
              onKeyDown={this.onKeyDownRenameText}
              value={modifiedText}/>
          </form>
          ) : (
          <Typography className={classes.text}>
            {text}
          </Typography>
          )}
        </Box>
        {!isEditing && (
        <div>
          <IconButton onClick={this.onOpenMenu}>
            <MoreVertIcon fontSize="small"/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.onCloseMenu}
          >
            <MenuItem onClick={this.onSelectRename}>
              Rename
            </MenuItem>
            <MenuItem className={classes.deleteText} onClick={this.onSelectDelete}>
              Delete
            </MenuItem>
          </Menu>
        </div>)}
      </Box>
    )
  }
}

export default withStyles(styles)(NodeHeader)
