import React from 'react'
import PropTypes from 'prop-types'

function Row({
    company,
    role,
    title,
    subtitle,
    date,
    location,
    website,
    client,
    highlights
}) {
    const roleText = role || title
    const companyText = company || subtitle
    const points = Array.isArray(highlights) ? highlights : []

    return (
        <div className="Timeline-row">
            <div className="Timeline-rowContainer">
                <div className="Timeline-rowContent">
                    <h4 className="Timeline-rowHeading has-text-weight-semibold is-size-5">
                        {website ? (
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {companyText}
                            </a>
                        ) : (
                            companyText
                        )}
                        {roleText ? <span className="Timeline-separator"> | </span> : null}
                        {roleText ? <span className="Timeline-role">{roleText}</span> : null}
                    </h4>
                    <p className="Timeline-rowMeta is-size-7">
                        <span>{date}</span>
                        {location ? <span className="Timeline-separator"> | </span> : null}
                        {location ? <span>{location}</span> : null}
                    </p>
                    {client ? (
                        <p className="Timeline-rowClient is-size-7">Client: {client}</p>
                    ) : null}
                    {points.length > 0 ? (
                        <ul className="Timeline-rowHighlights">
                            {points.map((point, index) => (
                                <li key={`${index}-${point}`}>{point}</li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

Row.propTypes = {
    company: PropTypes.string,
    role: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    website: PropTypes.string,
    client: PropTypes.string,
    highlights: PropTypes.arrayOf(PropTypes.string)
}


export default Row
