
module.exports = {
  cache: true,
  debug: true,
  devtool: 'eval',
  entry: '../frontend/app.js',
  //watch: true,
  keepalive: true,
  output: {
    path: '../../build',
    filename: 'main.min.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.coffee']
    // root: [path.join(__dirname, ''/client/'')]
    //moduleDirectories: ['node_modules', 'bower_components']
    //alias: { jquery: 'dist/jquery.js' }
  },
  /*,
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    )
  ]
  */
  module: {
    loaders: [
      // Used for reactjs
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ],
    postLoaders: [
      {
        test: /\.js$/, // include .js files
        exclude: [/bower_components/, /node_modules/], // exclude more files
        loader: 'jshint-loader'
      }
    ]
  }
};
