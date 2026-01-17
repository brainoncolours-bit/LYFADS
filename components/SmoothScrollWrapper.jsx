"use client"
import React from 'react'
import { ReactLenis } from 'lenis/react'
const SmoothScrollWrapper = ({children}) => {
  return (
    <ReactLenis root options={{lerp:0.05}}>
        {children}
    </ReactLenis>
  )
}

export default SmoothScrollWrapper