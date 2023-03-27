const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    output: 'export',
    distDir: 'dist',
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
