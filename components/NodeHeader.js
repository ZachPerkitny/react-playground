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
    cursor: 'pointer',
    flexGrow: 1,
  },
  rootUnselected: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  rootSelected: {
    backgroundColor: theme.palette.action.selected,
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
    selected: PropTypes.bool.isRequired,
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
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = ({ target }) => {
    if (this.state.isEditing && this.ref && !this.ref.current.contains(target)) {
      this.setState({
        isEditing: false,
      })
      this.props.onRename(this.state.modifiedText)
    }
  }

  handleClickContainer = (e) => {
    if (this.props.onClick) this.props.onClick()
  }

  handleChangeRenameText = (e) => {
    this.setState({
      modifiedText: e.target.value,
    })
  }

  handleKeyDownRenameText = ({ keyCode }) => {
    if (keyCode === 27) {
      this.setState({
        isEditing: false,
      })
    }
  }

  handleRenameFormSubmit = (e) => {
    e.preventDefault()
    this.setState({
      isEditing: false,
    })
    this.props.onRename(this.state.modifiedText)
  }

  handleOpenMenu = (e) => {
    e.stopPropagation()
    this.setState({
      anchorEl: e.target,
    })
  }

  handleCloseMenu = (e) => {
    e.stopPropagation()
    this.setState({
      anchorEl: null,
    })
  }

  handleSelectRename = (e) => {
    e.stopPropagation()
    this.setState({
      anchorEl: null,
      isEditing: true,
      modifiedText: this.props.text,
    })
  }

  handleSelectDelete = (e) => {
    e.stopPropagation()
    this.setState({ anchorEl: null })
    this.props.onDelete()
  }

  render() {
    const {
      classes,
      icon,
      selected,
      text,
    } = this.props
    const {
      anchorEl,
      isEditing,
      modifiedText,
    } = this.state
    const rootClass = (selected) ?
      `${classes.root} ${classes.rootSelected}` :
      `${classes.root} ${classes.rootUnselected}`
    return (
      <Box
        className={rootClass}
        display="flex"
        justifyContent="space-between"
        onClick={this.handleClickContainer}
        ref={this.ref}
      >
        <Box display="flex" alignItems="center">
          {icon}
          {(isEditing) ? (
          <form onSubmit={this.handleRenameFormSubmit} className={classes.form}>
            <TextField
              autoFocus="true"
              className={classes.textField}
              onClick={(e) => e.stopPropagation()}
              onChange={this.handleChangeRenameText}
              onKeyDown={this.handleKeyDownRenameText}
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
          <IconButton onClick={this.handleOpenMenu}>
            <MoreVertIcon fontSize="small"/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleCloseMenu}
          >
            <MenuItem onClick={this.handleSelectRename}>
              Rename
            </MenuItem>
            <MenuItem className={classes.deleteText} onClick={this.handleSelectDelete}>
              Delete
            </MenuItem>
          </Menu>
        </div>)}
      </Box>
    )
  }
}

export default withStyles(styles)(NodeHeader)
