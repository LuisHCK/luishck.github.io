import PropTypes from 'prop-types'
import {
    IconBrandAndroid,
    IconBrandAngular,
    IconBrandApple,
    IconBrandJavascript,
    IconBrandNodejs,
    IconBrandPython,
    IconBrandReact,
    IconBrandVue,
    IconBrandGithub,
    IconDatabase,
    IconServer,
} from '@tabler/icons-react'

function DevIcon({
    name,
    color,
    height,
    width,
}) {
    const logoProps = {
        color,
        height,
        width
    }

    const logos = {
        react: <IconBrandReact {...logoProps} />,
        vue: <IconBrandVue {...logoProps} />,
        android: <IconBrandAndroid {...logoProps} />,
        javascript: <IconBrandJavascript {...logoProps} />,
        nodejs: <IconBrandNodejs {...logoProps} />,
        angular: <IconBrandAngular {...logoProps} />,
        python: <IconBrandPython {...logoProps} />,
        apple: <IconBrandApple {...logoProps} />,
        github: <IconBrandGithub {...logoProps} />,
        express: <IconServer {...logoProps} />,
        postgres: <IconDatabase {...logoProps} />,
    }

    return logos[name] ?? null
}

DevIcon.propTypes = {
    name: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    color: PropTypes.string
}


export default DevIcon

// Export icon names
export const REACT = 'react'
export const VUE = 'vue'
export const ANDROID = 'android'
export const JAVASCRIPT = 'javascript'
export const NODEJS = 'nodejs'
export const ANGULAR = 'angular'
export const APPLE = 'apple'
export const PYTHON = 'python'
export const GITHUB = 'github'
export const EXPRESS = 'express'
export const POSTGRES = 'postgres'
