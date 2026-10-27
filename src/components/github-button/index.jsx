import DevIcon from '../dev-icon'

const GithubButton = ({ url }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="button is-light is-rounded"
        >
            <span>View in GitHub</span>
            <span className="icon is-medium">
                <DevIcon name="github" />
            </span>
        </a>
    )
}

export default GithubButton
