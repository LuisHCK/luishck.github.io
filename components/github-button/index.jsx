import Link from 'next/link'
import React from 'react'
import DevIcon from '../dev-icon'

const GithubButton = ({ url }) => {
    return (
        <Link
            href={url}
            target="_blank"
            referrerPolicy="no-referrer"
            className="button is-light is-rounded"
        >
            <span>View in GitHub</span>
            <span className="icon is-medium">
                <DevIcon name="GITHUB" />
            </span>
        </Link>
    )
}

export default GithubButton
