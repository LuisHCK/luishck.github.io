import React from 'react'
import PropTypes from 'prop-types'
import TimeLine from '../timeline'

function WorkExperience({
    title,
    jobs,
}) {

    return (
        <section className="box">
            <h3 className="is-size-3 has-text-weight-bold mb-4">{title}</h3>
            <TimeLine rows={jobs} />
        </section>
    )
}

WorkExperience.propTypes = {
    title: PropTypes.string,
}


export default WorkExperience
