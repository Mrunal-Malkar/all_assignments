import { useState } from 'react'
import * as solana from "@solana/web3.js"

import './App.css'
import Wallet from './Wallet'

function App() {

  return (
    <>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">SOLANA_GEN</h1>
        <div className="text-xs uppercase tracking-widest text-white/40">Network: None</div>
      </nav>

    <Wallet/>
    </>
  )
}

export default App
