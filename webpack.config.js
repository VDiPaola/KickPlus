const path = require('path');

module.exports = {
    entry: {
        'content-scripts/main': './src/content-scripts/main.js',
        './src/content-scripts/Elements/ChatUserBox': './src/content-scripts/Elements/ChatUserBox.js',

        'background': './src/background-scripts/main.js',

        'options-page/main': './src/options-page/main.js',
        
        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
};