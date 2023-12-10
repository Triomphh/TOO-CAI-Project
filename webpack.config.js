const path = require('path');

module.exports = {
  mode: 'development', 
  entry: './ts/app.ts', 
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], 
  },
  output: {
    filename: 'app.js', 
    path: path.resolve(__dirname, 'js'), 
  },
};
