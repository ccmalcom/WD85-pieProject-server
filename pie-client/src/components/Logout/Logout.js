import React from 'react';
import './Logout.css';
import logoutPic from '../../assets/logoutpic.png'

const Logout = () => {
    return(
        <div>
            <img id='logout' src={logoutPic} alt='powerButton' />
        </div>
    )
}

export default Logout;