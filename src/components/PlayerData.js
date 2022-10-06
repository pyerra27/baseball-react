import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import BaseballService from '../services/BaseballService'

import DataTable from './DataTable'

/**
 * Displays tables showing a player's batting and pitching data
 * over their careers. Uses DataTable component to build tables.
 */
function PlayerData() {
    /* stores player batting data */
    const [playerBatting, setPlayerBatting] = useState([])

    /* boolean to see if batting data is loading */
    const [battingLoadingData, setBattingLoadingData] = useState(true)

    /* stores player pitching data */
    const [playerPitching, setPlayerPitching] = useState([])

    /* boolean to see if pitching data is loading */
    const [pitchingLoadingData, setPitchingLoadingData] = useState(true)

    /* player name */
    const [playerName, setPlayerName] = useState("")

    /* player id from the url */
    const {playerID} = useParams()

    /**
     * On component load, get the data needed for the page
     */
    useEffect(() => {
        getData(playerID)
    }, [])

    /**
     * Get all of the data needed for the state of the component
     * 
     * @param playerID id of player
     */
    const getData = (playerID) => {
        getPlayerName(playerID)
        getPlayerBatting(playerID)
        getPlayerPitching(playerID)
    }

    /**
     * Gets the player's name using the getPlayerName function from
     * BaseballService
     *
     * @param playerID id of player
     */
    const getPlayerName = (playerID) => {
        BaseballService.getPlayerName(playerID).then(response => {
            setPlayerName(response.data["name"])
        })
    }

    /**
     * Gets the player's batting data using the getPlayerBatting function from
     * BaseballService
     *
     * @param playerID id of player
     */
    const getPlayerBatting = (playerID) => {
        BaseballService.getPlayerBatting(playerID).then(response => {
            response.data.forEach(entry => {
                entry["Team"] = <a href={"/team/" + entry["franchID"]}>{entry["franchID"]}</a>
            });

            setPlayerBatting(response.data)
            setBattingLoadingData(false)
        }).catch(error => {
            setBattingLoadingData(false)
        })
    }

    /**
     * Gets the player's pitching data using the getPlayerPitching function from
     * BaseballService
     *
     * @param playerID id of player
     */
    const getPlayerPitching = (playerID) => {
        BaseballService.getPlayerPitching(playerID).then(response => {
            response.data.forEach(entry => {
                entry["Team"] = <a href={"/team/" + entry["franchID"]}>{entry["franchID"]}</a>
            });

            setPlayerPitching(response.data)
            setPitchingLoadingData(false)
        }).catch(error => {
            setPitchingLoadingData(false)
        })
    }
    
    return (
        <Container fluid>
            {
                playerID === "" ? ("No player selected") : (
                    <>
                    <h1>{playerName}</h1>
                    <Tab.Container id="player-tabs" defaultActiveKey="batting">
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="batting">Batting</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="pitching">Pitching</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="batting">
                                        {
                                            battingLoadingData ? (<div>Data is Loading</div>) : (
                                                playerBatting.length === 0 ? (<div>There is no batting data for this player</div>) : (
                                                    <DataTable 
                                                        data = {playerBatting}
                                                        visibleCols = {["Year", "Team", "LG", "G", "AB", "HR", "RBI"]}
                                                        filterCol = {"G"}
                                                        sortCol = {"Year"}
                                                        linkCol = {"Team"}/>
                                                )
                                            )
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="pitching">
                                    {
                                            pitchingLoadingData ? (<div>Data is Loading</div>) : (
                                                playerPitching.length === 0 ? (<div>There is no pitching data for this player</div>) : (
                                                    <DataTable 
                                                        data = {playerPitching}
                                                        visibleCols = {["Year", "Team", "LG", "G", "IP", "ERA"]}
                                                        filterCol = {"G"}
                                                        sortCol = {"Year"}
                                                        linkCol = {"Team"}/>
                                                )
                                            )
                                        }
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    </> 
                )
            }
        </Container>
    )
}

export default PlayerData