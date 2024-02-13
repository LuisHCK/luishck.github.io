const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    output: 'export',
    distDir: 'out',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },

    webpack: function (config) {
        config.module.rules.push({
            test: /\.ya?ml$/,
            use: 'js-yaml-loader',
        })
        return config
    },
}
