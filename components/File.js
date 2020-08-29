import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import DescriptionIcon from '@material-ui/icons/Description'
import FileHeader from './FileHeader'
import CSSIcon from './icons/CSS'
import JSIcon from './icons/JS'

const useStyles = makeStyles(theme => ({}))

const File = ({ depth, file }) => {
  const classes = useStyles()

  let icon
  const ext = file.name.split('.')[1]
    switch (ext) {
    case 'css':
      icon = <CSSIcon fontSize="small"/>
      break
    case 'js':
      icon = <JSIcon fontSize="small"/>
      break
    default:
      icon = <DescriptionIcon fontSize="small"/>
      break
    }

  return (
    <FileHeader
      depth={depth}
      icon={icon}
      text={file.name}
    />
  )
}

export default File
