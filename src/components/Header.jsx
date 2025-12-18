import React from 'react'
import NavBar from './NavBar'

export default function Header() {
  return (
    <div className='flex justify-around bg-black'>
         <h1 className="text-4xl md:text-5xl font-[Plank] text-slate-100 text-center tracking-[0.2em] pt-8 pb-8">Y2K GAMES</h1>
         <NavBar></NavBar>
    </div>
  )
}
