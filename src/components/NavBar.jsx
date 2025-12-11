import React from 'react'

export default function NavBar() {
   return (
    <div className='flex py-2 text-slate-100 px-16 font-[Nuls] bg-black justify-between'>
      <div to="/">
        <h2>Y2K</h2>
      </div>
      <nav className='flex text-slate-100 justify-around'>
        <div to='/' className='px-4 text-slate-100'>CLIPS</div>
        <div to='/' className='px-4 text-slate-100'>MUSIC</div>
        <div to='/' className='px-4 text-slate-100'>BIO</div>
        <div to='/' className='px-4 text-slate-100'>MERCH</div>
      </nav>
    </div>
  ) 
}
