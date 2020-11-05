import {Link } from 'react-router-dom';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import HomeIcon from '@material-ui/icons/Home';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import './Nav.css'
import {Navbar, Nav} from 'react-bootstrap'
import MediaQuery from 'react-responsive'




export default function Navi() {

    const [value,setValue] = useState(); 
    
    const[windowWidth, setWindowWidth] = useState(0);

    var updateDimensions = () => {
        var ww = typeof window !== "undefined" ? window.innerWidth : 0;
        console.log(ww);
        setWindowWidth(ww);
    };


    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize',updateDimensions())
    });

    return (
        <div>
            <MediaQuery maxWidth={1000}>
                <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels={true}
                className="styleBar" 
                >
                    <BottomNavigationAction label="Run" icon={<DirectionsRunIcon />} component={Link} to='/run' /> 
                    <BottomNavigationAction label="Home"  icon={<HomeIcon />} component={Link} to='/' /> 
                    <BottomNavigationAction label="Graph" icon={<TrendingUpIcon />} component={Link} to='/graph' /> 

                </BottomNavigation>
            </MediaQuery>

            
            <MediaQuery minWidth={1000}>
                <Navbar bg="light">
                    <Navbar.Brand as={Link} to="/" >Hashiru</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/run">Run</Nav.Link>
                        <Nav.Link as={Link} to="/graph">Graph</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                        Dernière màj le 05/11/2020
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            </MediaQuery>


            
        </div>


    );
}


