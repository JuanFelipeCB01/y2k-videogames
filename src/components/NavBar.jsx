import React from 'react'

export default function NavBar() {
   return (
    <div className='flex py-2 text-slate-100 px-16 font-[Nuls] bg-black justify-between'>
      <nav className='flex items-center text-slate-100 justify-around'>
        <div to='/' className='px-4 text-slate-100'>GAMES</div>
        <div to='/' className='px-4 text-slate-100'>BIO</div>
        <div to='/' className='px-4 text-slate-100'>About</div>
      </nav>
    </div>
  ) 
}
