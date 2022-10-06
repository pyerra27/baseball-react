import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import BaseballService from '../services/BaseballService'

import DataTable from './DataTable'

function PlayerData() {
    const [playerBatting, setPlayerBatting] = useState([])
    const [battingLoadingData, setBattingLoadingData] = useState(true)

    const [playerPitching, setPlayerPitching] = useState([])
    const [pitchingLoadingData, setPitchingLoadingData] = useState(true)

    const [playerName, setPlayerName] = useState("")

    const {playerID} = useParams()

    useEffect(() => {
        getData(playerID)
    }, [])

    const getData = (playerID) => {
        getPlayerName(playerID)
        getPlayerBatting(playerID)
        getPlayerPitching(playerID)
    }

    const getPlayerName = (playerID) => {
        BaseballService.getPlayerName(playerID).then(response => {
            setPlayerName(response.data["name"])
        })
    }

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