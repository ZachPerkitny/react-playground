import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import Box from '@material-ui/core/Box'
import Editor from '../components/Editor'
import Header from '../components/Header'

require('ace-builds/src-noconflict/mode-javascript')
require('ace-builds/src-noconflict/snippets/javascript')

const Home = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const onRun = (code) => {
    console.log(code)
  }

  const onSave = (code) => {
    console.log(code)
    enqueueSnackbar('Successfully saved.', { 
        variant: 'success',
    })
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{ height: '100vh' }}
    >
      <Header/>
      <Editor
        onRun={onRun}
        onSave={onSave}
      />
    </Box>
  )
}

export default Home
