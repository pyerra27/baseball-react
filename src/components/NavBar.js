import React, {useState, useEffect} from 'react'

import BaseballService from '../services/BaseballService'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Dropdown from 'react-bootstrap/Dropdown'

/**
 * Component for the Navbar on all pages. Contains logic to get all franchises
 * and create a link to each of the team pages
 */
function NavBar() {
    /* list of active franchises */
    const [franchises, setFranchises] = useState([])

    /**
     * Runs on component load
     */
    useEffect(() => {
        getFranchises()
    }, [])
    
    /**
     * Gets the franchises using the getFranchises function from
     * BaseballService
     */
    const getFranchises = () => {
        BaseballService.getFranchises().then(response => {
            setFranchises(response.data)
        })
    }

    /* style for team dropdown menu */
    const dropdownStyle = {
        maxHeight: "200px",
        overflowY: "scroll"
    }

    return (
        <Navbar variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">Baseball Database</Navbar.Brand>
                <Navbar.Toggle aria-controls="baseball-navbar" />
                <Navbar.Collapse id="baseball-navbar">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Dropdown as={NavItem}>
                            <Dropdown.Toggle as={NavLink}>Active Franchises</Dropdown.Toggle>
                            <Dropdown.Menu style={dropdownStyle}>
                                {
                                    // for each franchise return a link to their team page
                                    franchises.map(franchise => {
                                        return <Dropdown.Item key={franchise["franchID"]} href={"/team/" + franchise["franchID"]}>{franchise["franchName"]}</Dropdown.Item>
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar