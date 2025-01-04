import { useEffect, useState, useRef } from 'react';
import './App.css';

import './components/CanReceived.jsx'
import CanReceived from './components/CanReceived.jsx';
import CanTransfer from './components/CanTransfer';


const App = () => {
  
    return (

        <div className="container">
            <div className = "header">
                <div className="headerTitle">

                    <h5>Adam Burny</h5>
                    <h1>CAN Diagnostic Tool</h1>

                </div>
            </div>
            <div className="mainContainer">
                <CanReceived />
                <CanTransfer />
            </div>
            </div>

    );
    

}

export default App;