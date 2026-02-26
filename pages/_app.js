
import '../styles/globals.scss'
import { StyleSheetManager } from 'styled-components';

function shouldForwardProp(prop) {
    // Filter out shake and beat props
    return prop !== 'shake' && prop !== 'beat';
}

function MyApp({ Component, pageProps }) {
    return (
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <Component {...pageProps} />
        </StyleSheetManager>
    );
}

export default MyApp
