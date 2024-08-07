import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{background:"#007FFF",height:"50px"}}>
            <ul style={{marginLeft:"1155px"}}>
                <li><Link to="/signin"><button style={{color:"blue",borderRadius:"5px",border:"white"}}>Login</button></Link></li>
                <li><Link to="/signup"><button style={{color:"blue",borderRadius:"5px",border:"white"}}>Sign Up</button></Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
