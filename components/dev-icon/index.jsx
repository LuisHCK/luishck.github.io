import React from 'react'
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
    IconBrandGithub
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
        REACT: <IconBrandReact {...logoProps} />,
        VUE: <IconBrandVue {...logoProps} />,
        ANDROID: <IconBrandAndroid {...logoProps} />,
        JAVASCRIPT: <IconBrandJavascript {...logoProps} />,
        NODEJS: <IconBrandNodejs {...logoProps} />,
        ANGULAR: <IconBrandAngular {...logoProps} />,
        PYTHON: <IconBrandPython {...logoProps} />,
        APPLE: <IconBrandApple {...logoProps} />,
        GITHUB: <IconBrandGithub {...logoProps} />
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
