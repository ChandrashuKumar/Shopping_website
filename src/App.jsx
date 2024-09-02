import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import {
  HomePage
} from "./components";

function App() {

  return (
    <>
      <Header/>
      <HomePage/>
      <Footer/>
    </>
  )
}

export default App
