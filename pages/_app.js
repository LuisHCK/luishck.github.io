
import '../styles/globals.scss'
import { StyleSheetManager } from 'styled-components';
import Script from 'next/script'

function shouldForwardProp(prop) {
    // Filter out shake and beat props
    return prop !== 'shake' && prop !== 'beat';
}

function MyApp({ Component, pageProps }) {
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <Script src="https://analytics.luisjcenteno.dev/script.js" data-website-id="2c1eb7da-c2ec-47eb-8e4b-d741d9ff8e9f" />
            <Component {...pageProps} />
        </StyleSheetManager>
    );
}

export default MyApp
