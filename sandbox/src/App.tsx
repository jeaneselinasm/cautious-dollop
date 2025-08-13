import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Posts from './components/Posts'
import { Users } from './components/Users'

function App() {

  return (
    <>
      <Posts/>
      <Users/>
    </>
  )
}

export default App
