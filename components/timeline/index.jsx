import React from 'react'
import PropTypes from 'prop-types'
import Row from './row'

function TimeLine({
    rows,
}) {

    const renderRows = () =>
        rows.map((row, index) => (
            <li key={'timeline-row-item' + index}>
                <Row {...row} />
            </li>
        ))

    return (
        <div className="Timeline">
            <ul>{renderRows()}</ul>
        </div>
    )
}

TimeLine.propTypes = {
    rows: PropTypes.array,
}


export default TimeLine
