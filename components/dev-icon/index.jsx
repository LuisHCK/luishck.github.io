import React from 'react'
import PropTypes from 'prop-types'
import {
    LogoAndroid,
    LogoAngular,
    LogoApple,
    LogoJavascript,
    LogoNodejs,
    LogoPython,
    LogoReact,
    LogoVue,
    LogoGithub
} from 'react-ionicons'

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
        REACT: <LogoReact {...logoProps} />,
        VUE: <LogoVue {...logoProps} />,
        ANDROID: <LogoAndroid {...logoProps} />,
        JAVASCRIPT: <LogoJavascript {...logoProps} />,
        NODEJS: <LogoNodejs {...logoProps} />,
        ANGULAR: <LogoAngular {...logoProps} />,
        PYTHON: <LogoPython {...logoProps} />,
        APPLE: <LogoApple {...logoProps} />,
        GITHUB: <LogoGithub />
    }

    try {
        return logos[name]
    } catch (error) {
        console.error(`Logo whith name: "${name}" can't be found!`)
    }
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
