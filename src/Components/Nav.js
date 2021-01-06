// React
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

// Styles imports
import './Nav.css'

import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import HomeIcon from '@material-ui/icons/Home';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

import { Navbar, Nav } from 'react-bootstrap'
import MediaQuery from 'react-responsive'


const styles = {
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
};

export default function Navi() {

    const [value, setValue] = useState();


    return (
        <div>
            <MediaQuery maxDeviceWidth={1000}>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    showLabels={true}
                    className="fixed-bottom"
                >
                    <BottomNavigationAction label="Run" icon={<DirectionsRunIcon />} component={Link} to='/run' />
                    <BottomNavigationAction label="Home" icon={<HomeIcon />} component={Link} to='/' />
                    <BottomNavigationAction label="Analyse" icon={<TrendingUpIcon />} component={Link} to='/upload' />

                </BottomNavigation>
            </MediaQuery>


            <MediaQuery minDeviceWidth={1000}>
                <Navbar className="navbar navbar-dark ">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/" >        


                        </Nav.Link>
                        <Nav.Link as={Link} to="/" className="navText">Accueil</Nav.Link>
                        <Nav.Link as={Link} to="/run" className="navText " >Course</Nav.Link>
                        <Nav.Link as={Link} to="/upload" className="navText">Analyse</Nav.Link>
                    </Nav>
                    <Navbar.Brand className="justify-content-end">
                        <Navbar.Brand>
                            <img
                                src="bluebody.png"
                                height="40"
                                alt="Hashiru"
                            />
                        </Navbar.Brand>
                    </Navbar.Brand>
                    <Navbar.Brand className="justify-content-end">
                        <Navbar.Brand>
                            <img
                                src="bluetxt.png"
                                height="40"
                                alt="Hashiru"
                            />
                        </Navbar.Brand>
                    </Navbar.Brand>
                </Navbar>
            </MediaQuery>



        </div>


    );
}


