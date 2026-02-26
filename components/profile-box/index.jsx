import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { AtOutline, LocationOutline } from 'react-ionicons'

function ProfileBox({
    name,
    role,
    email,
    country,
    skills,
    avatar,
}) {

    const renderSkills = () =>
        skills.map((skill, index) => (
            <li key={'skill-' + index} className="ProfileBox-listItem">
                {skill}
            </li>
        ))

    return (
        <section className="box ProfileBox">
            <div className="ProfileBox-avatarContainer">
                <img
                    src={avatar}
                    alt={`${name} | ${role}`}
                    className="ProfileBox-avatar"
                    width={200}
                    height={200}
                />
            </div>

            <h1 className="ProfileBox-name is-size-2 has-text-weight-bold">{name}</h1>
            <h2 className="ProfileBox-role is-size-5">{role}</h2>

            <div className="ProfileBox-contact">
                <span className="has-text-weight-bold">Contact</span>
                <ul>
                    <li className="ProfileBox-listItem">
                        <AtOutline width="22px" color="white" />
                        <Link href={`mailto:${email}`} target="_blank">
                            {email}
                        </Link>
                    </li>

                    <li className="ProfileBox-listItem">
                        <LocationOutline width="22px" color="white" />
                        <span>{country}</span>
                    </li>
                </ul>
            </div>

            <div className="ProfileBox-skills">
                <span className="has-text-weight-bold">Skills</span>
                <ul>{renderSkills()}</ul>
            </div>
        </section>
    )
}


ProfileBox.propTypes = {
    name: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    skills: PropTypes.array,
    avatar: PropTypes.string
}

export default ProfileBox
