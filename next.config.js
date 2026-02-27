const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    output: 'export',
    poweredByHeader: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}
