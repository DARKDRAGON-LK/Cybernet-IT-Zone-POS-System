import React from 'react'
import "./Navbar.css"
import {BsShopWindow} from "react-icons/bs"
import DateTime from '../dateTime/DateTime'


function Nav() {
  return (
      <div className='bg'>
        <div className='shopName'>
        <div className='shopIcon'><BsShopWindow/></div>
        <p>CyberNet IT</p>
        </div>
      <div className='dateTime'>
        <p className='date'><DateTime/></p>
      </div>
      </div>
  )
}

export default Nav