import React, {useState, useEffect} from 'react'

import { CSVLink, CSVDownload } from "react-csv";

import Container from 'react-bootstrap/Container'
import Row  from 'react-bootstrap/Row'
import Col  from 'react-bootstrap/Col'
import Table  from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Dropdown  from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup'

function DataTable({data, visibleCols, filterCol, sortCol, linkCol}) {
    const [dataEntries, setDataEntries] = useState([])
    const [csvDataEntries, setCSVDataEntries] = useState([])
    const [visibleColumns, setVisibleColumns] = useState([])
    const [allColumns, setAllColumns] = useState([])
    const [filterColumn, setFilterColumn] = useState("")
    const [filterValue, setFilterValue] = useState(1)
    const [sortColumn, setSortColumn] = useState("")
    const [sortDirection, setSortDirection] = useState(-1)
    const [linkColumn, setLinkColumn] = useState("")
  
    useEffect(() => {
        setVisibleColumns(visibleCols)
        setFilterColumn(filterCol)
        setSortColumn(sortCol)
        setLinkColumn(linkCol)

        setDataEntries(data.sort(createSortFunction(sortCol, sortDirection)))
        
        let tempAllColumns = []
        for (const column in data[0]) {
            tempAllColumns.push(column)
        }

        setAllColumns(tempAllColumns)
    }, [])

    const onFilterChange = (e) => {
        setFilterValue(e.target.value)   
    }

    const createSortFunction = (column, direction) => {
        return function (a,b) {
            let result = (a[column] < b[column]) ? -1 : (a[column] > b[column]) ? 1 : 0
            return result * direction
        }
    }

    const sortDataEntries = (e, column, direction) => {
        setSortColumn(column)
        setSortDirection(direction)

        dataEntries.sort(createSortFunction(column, direction))
    }

    const removeColumn = (e, column) => {
        let colIndex = visibleColumns.indexOf(column) 
        if (colIndex > -1) { 
            visibleColumns.splice(colIndex, 1)
        }

        setVisibleColumns([...visibleColumns])
    }

    const addColumn = (e, column) => {
        visibleColumns.push(column)
        setVisibleColumns([...visibleColumns])
    }

    const changeColumnPosition = (e, column) => {
        let oldIndex = visibleColumns.indexOf(column)
        visibleColumns.splice(oldIndex, 1)
        visibleColumns.splice(e.target.value - 1, 0, column);
        setVisibleColumns([...visibleColumns])
    }

    const getCSVData = (event) => {
        setCSVDataEntries([])

        let tempCSVDataEntries = []
        dataEntries.forEach(entry => {
            if (entry[filterCol] >= filterValue) {
                let csvEntry = {...entry}
                console.log(linkColumn)
                if (linkColumn !== undefined) {
                    csvEntry[linkColumn] = csvEntry[linkColumn].props.children
                }
                tempCSVDataEntries.push(csvEntry)
            }
        })

        setCSVDataEntries(tempCSVDataEntries)
    }

    const tableHeaderStyle = {
        float: "left"
    }

    const dropdownStyle = {
        maxHeight: "200px",
        overflowY: "scroll"
    }

    const selectStyle = {
        width: "100px",
        align: "center"
    }

    return (
        <Container fluid> 
            {
                filterColumn === undefined ? (null) : (
                    <Row>
                        <Col xs={3}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id={`{filterColumn}filter`}>Min {filterColumn} Filter</InputGroup.Text>
                                <Form.Control
                                    placeholder=""
                                    aria-label={`{filterColumn}filter`}
                                    aria-describedby={`{filterColumn}filter`}
                                    value={filterValue}
                                    onChange={event => onFilterChange(event)}/>
                            </InputGroup>
                        </Col>
                        <Col xs={2}>
                            <CSVLink headers={visibleColumns} data={csvDataEntries} onClick={event => getCSVData(event)}
                                filename={"baseballData.csv"} className="btn btn-primary">
                                Download me
                            </CSVLink>
                        </Col>
                    </Row>
                )
            }
            <Row>
                <Col>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                {
                                    visibleColumns.map((column, idx) => {
                                        return  <th key={column}>
                                                    <div style={tableHeaderStyle}>{column}</div>
                                                    <Dropdown>
                                                        <Dropdown.Toggle size="sm" variant="dark" id={`dropdown-{column}`}></Dropdown.Toggle>
                                                        <Dropdown.Menu style={dropdownStyle}>
                                                            {
                                                                sortColumn === column && sortDirection === 1 ? (null) : (
                                                                    <Dropdown.Item onClick={event => sortDataEntries(event, column, 1)}>Sort Ascending</Dropdown.Item>
                                                                )
                                                            }
                                                            {
                                                                sortColumn === column && sortDirection === -1 ? (null) : (
                                                                    <Dropdown.Item onClick={event => sortDataEntries(event, column, -1)}>Sort Descending</Dropdown.Item>
                                                                )
                                                            }
                                                            <Dropdown.Item onClick={event => removeColumn(event, column)}>Remove Column</Dropdown.Item>
                                                            <Dropdown.ItemText>Change Col #</Dropdown.ItemText>
                                                            <Dropdown.ItemText>
                                                                <Form.Select style={selectStyle} size="sm" defaultValue={idx + 1} onChange={event => changeColumnPosition(event, column)}>
                                                                    {
                                                                        visibleColumns.map((column, idx) => {
                                                                            return <option key={idx} value={idx + 1}>{idx + 1}</option>
                                                                        })
                                                                    }
                                                                </Form.Select>
                                                            </Dropdown.ItemText>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                    })
                                }
                                <th>
                                    <div style={tableHeaderStyle}>Add Column</div>
                                    <Dropdown>
                                        <Dropdown.Toggle size="sm" variant="dark" id="addColumn"></Dropdown.Toggle>
                                        <Dropdown.Menu style={dropdownStyle}>
                                            {
                                                allColumns.map(column => {
                                                    if (visibleColumns.indexOf(column) === -1) {
                                                        return <Dropdown.Item key={column} onClick={event => addColumn(event, column)}>{column}</Dropdown.Item>
                                                    }
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataEntries.map((entry, idx) => {
                                    if (filterColumn === undefined || entry[filterColumn] >= filterValue) {
                                        return  <tr key = {idx}>
                                                    {
                                                        visibleColumns.map(column => {
                                                            return <td key={`${idx + column}`}>{entry[column]}</td> 
                                                        })
                                                    }
                                                    <td></td>
                                                </tr>
                                    }
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default DataTable