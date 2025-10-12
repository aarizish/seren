import React from 'react'
import './Navbar.css'
import { MdArchitecture } from "react-icons/md";

const Navbar = () => {
    return (
        <>
            <div className='top-app-bar'>
                <ul>
                    <li><MdArchitecture className='app-icon'/></li>
                    <li><strong>Seren</strong></li>
                </ul>
            </div>
        </>
    )
}

export default Navbar