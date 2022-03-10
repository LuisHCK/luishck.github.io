import React from "react";
import PropTypes from "prop-types";

function Row(props) {
    const { title, subtitle, date, location, website } = props;

    return (
        <div className="Timeline-row">
            <div className="Timeline-rowContainer">
                <div className="Timeline-rowContent">
                    <h4 className="has-text-weight-bold is-size-5">{title}</h4>
                    <p className="is-size-7">
                        {website ? (
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {subtitle}
                            </a>
                        ) : (
                            subtitle
                        )}
                    </p>
                    <p className="is-size-7 has-text-grey-lighter">{date}</p>
                    <p className="is-size-7 has-text-grey-lighter">
                        {location}
                    </p>
                </div>
            </div>
        </div>
    );
}

Row.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    website: PropTypes.string,
};

Row.defaultProps = {
    website: undefined
}

export default Row;
