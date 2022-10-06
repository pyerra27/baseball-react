import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import BaseballService from '../services/BaseballService'

import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'  

import DataTable from './DataTable'

function TeamData() {
    const [teamBatting, setTeamBatting] = useState([])
    const [battingLoadingData, setBattingLoadingData] = useState(true)

    const [teamPitching, setTeamPitching] = useState([])
    const [pitchingLoadingData, setPitchingLoadingData] = useState(true)

    const [teamName, setTeamName] = useState("")
    const [year, setYear] = useState(new Date().getFullYear())
    const [availableYears, setAvailableYears] = useState([])
    
    
    const {teamID} = useParams()

    useEffect(() => {
        getData(teamID)
    }, [])

    const getData = (teamID) => {
        BaseballService.getFranchises().then(franchiseResponse => {
            let franchiseExists = false
            franchiseResponse.data.every(franchise => {
                if (franchise["franchID"] === teamID) {
                    franchiseExists = true
                    setTeamName(franchise["franchName"])
                    return false
                }

                return true
            })

            if (franchiseExists) {
                getAvailableYears()
                getTeamBatting(teamID, year)
                getTeamPitching(teamID, year)
            }
        })
    }

    const getAvailableYears = () => {
        let tempAvailableYears = []
        for (let i = year - 100; i <= year; i++) {
            tempAvailableYears.push(i)
        }
        setAvailableYears(tempAvailableYears)
    }

    const onYearChange = (event) => {
        setYear(event.target.value)

        getTeamBatting(teamID, event.target.value)
        getTeamPitching(teamID, event.target.value)
    }

    const getTeamBatting = (teamID, year) => {
        setTeamBatting([])
        setBattingLoadingData(true)

        BaseballService.getTeamBatting(teamID, year).then(response => {
            response.data.forEach(player => {
                player["Name"] = <a href={"/player/" + player["playerID"]}>{player["Name"]}</a>
            });
            setTeamBatting(response.data)
            setBattingLoadingData(false)
        }).catch(error => {
            console.log(error)
            setBattingLoadingData(false)
        })
    };

    const getTeamPitching = (teamID, year) => {
        setTeamPitching([])
        setPitchingLoadingData(true)

        BaseballService.getTeamPitching(teamID, year).then(response => {
            response.data.forEach(player => {
                player["Name"] = <a href={"/player/" + player["playerID"]}>{player["Name"]}</a>
            });
            setTeamPitching(response.data)
            setPitchingLoadingData(false)
        }).catch(error => {
            console.log(error)
            setPitchingLoadingData(false)
        })
    }

    return (
        <Container fluid>
            {
                teamName === "" ? ("There is no team with this abbreviation") : (
                    <>
                    <h1>{teamName}</h1>
                    <Row>
                        <Col xs={3}>
                        <InputGroup className="mb-3">
                                <InputGroup.Text id="year">Year</InputGroup.Text>
                                <Form.Select defaultValue={year} onChange={event => onYearChange(event)}>
                                    {
                                        availableYears.map(year => {
                                            return <option key={year} value={year}>{year}</option>
                                        })
                                    }
                                </Form.Select>
                                </InputGroup>
                        </Col>
                    </Row>
                    <Tab.Container id="team-tabs" defaultActiveKey="batting">
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
                                                teamBatting.length === 0 ? (<div>There is no data for this year</div>) : (
                                                    <DataTable 
                                                        data = {teamBatting}
                                                        visibleCols = {["Name", "PA", "HR", "RBI", "OPS+"]}
                                                        filterCol = {"PA"}
                                                        sortCol = {"PA"}
                                                        linkCol = {"Name"}/>
                                                )
                                            )
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="pitching">
                                        {
                                            pitchingLoadingData === true ? (<div>Data is Loading</div>) : (
                                                teamPitching.length === 0 ? (<div>There is no data for this year</div>) : (
                                                    <DataTable 
                                                        data = {teamPitching}
                                                        visibleCols = {["Pos", "Name", "IP", "ERA", "ERA+"]}
                                                        filterCol = {"IP"}
                                                        sortCol = {"IP"}
                                                        linkCol = {"Name"}/>
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

export default TeamData