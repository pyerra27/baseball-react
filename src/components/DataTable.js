import React, {useState, useEffect} from 'react'

import { CSVLink } from "react-csv";

import Container from 'react-bootstrap/Container'
import Row  from 'react-bootstrap/Row'
import Col  from 'react-bootstrap/Col'
import Table  from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Dropdown  from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup'

/**
 * Displays a table of data which can be modified by user. User can filter based
 * on the filter column, sort the data, choose which columns are visible and reorder
 * the columns in the table. Data can also be exported to a csv file.
 * 
 * All params are passed through call to the component in JSX.
 * 
 * TODO: Modify filterCol to allow for non-numerical types to be used
 * as a filterCol
 * 
 * @param data data to display
 * @param visibleCols starting visible columns
 * @param filterCol filter column for table
 * @param sortCol starting sort column for table
 * @param linkCol column used as link in table 
 */
function DataTable({data, visibleCols, filterCol, sortCol, linkCol}) {
    /* holds data to be displayed */
    const [dataEntries, setDataEntries] = useState([])

    /* data to be printed to csv */
    const [csvDataEntries, setCSVDataEntries] = useState([])

    /* current set of visible columns */
    const [visibleColumns, setVisibleColumns] = useState([])

    /* all columns in data */
    const [allColumns, setAllColumns] = useState([])

    /* column used for filtering */
    const [filterColumn, setFilterColumn] = useState("")

    /* current fitler value */
    const [filterValue, setFilterValue] = useState(1)

    /* current column used for sorting */
    const [sortColumn, setSortColumn] = useState("")

    /* current sorting direction */
    const [sortDirection, setSortDirection] = useState(-1)

    /* column being used as a link */
    const [linkColumn, setLinkColumn] = useState("")
  
    /**
     * On component load, load the parameters into their state variables
     */
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

    /**
     * Handle a change in the filer input box
     * 
     * @param e event 
     */
    const onFilterChange = (e) => {
        setFilterValue(e.target.value)   
    }

    /**
     * Creates the compare function used by Array.sort in javascript
     * 
     * @param column column to sort by
     * @param direction direction of sort (1 for ascending, -1 for descending)
     * @returns compare function
     */
    const createSortFunction = (column, direction) => {
        return function (a,b) {
            let result = (a[column] < b[column]) ? -1 : (a[column] > b[column]) ? 1 : 0
            return result * direction
        }
    }

    /**
     * Sorts the data based on the column and direction
     * @param e event
     * @param column column to sort by
     * @param direction direction of sort (1 for ascending, -1 for descending)
     */
    const sortDataEntries = (e, column, direction) => {
        setSortColumn(column)
        setSortDirection(direction)

        dataEntries.sort(createSortFunction(column, direction))
    }

    /**
     * Removes the column from the visible columns list
     * 
     * @param e event 
     * @param column column to remove
     */
    const removeColumn = (e, column) => {
        let colIndex = visibleColumns.indexOf(column) 
        if (colIndex > -1) { 
            visibleColumns.splice(colIndex, 1)
        }

        setVisibleColumns([...visibleColumns])
    }

    /**
     * Adds the column to the visible column list
     * 
     * @param e event
     * @param column column to add to visible column list
     */
    const addColumn = (e, column) => {
        visibleColumns.push(column)
        setVisibleColumns([...visibleColumns])
    }

    /**
     * Moves column to the position given from the event that
     * triggers this function
     * 
     * @param e event
     * @param column column to change position of
     */
    const changeColumnPosition = (e, column) => {
        let oldIndex = visibleColumns.indexOf(column)
        visibleColumns.splice(oldIndex, 1)
        visibleColumns.splice(e.target.value - 1, 0, column);
        setVisibleColumns([...visibleColumns])
    }

    /**
     * Prepares the csv data 
     * @param e event
     */
    const getCSVData = (e) => {
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

    /* style for column names */
    const tableHeaderStyle = {
        float: "left"
    }

    /* style for dropdowns in columns */
    const dropdownStyle = {
        maxHeight: "200px",
        overflowY: "scroll"
    }

    /* style for select field in column dropdown */
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
                        <Col xs={3}>
                            <CSVLink headers={visibleColumns} data={csvDataEntries} onClick={event => getCSVData(event)}
                                filename={"baseballData.csv"} className="btn btn-primary">
                                Export Table to CSV
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