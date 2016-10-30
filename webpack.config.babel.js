/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import validate from 'webpack-validator';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import stylelint from 'stylelint';
import precss from 'precss';
import postcssImport from 'postcss-import';
import webpack from 'webpack';
import merge from 'webpack-merge';
import NodePathReplacePlugin from './NodePathReplacePlugin.js';

export const cssModuleNames = '[name]__[local]___[hash:base64:5]';

function getCssLoaders() {
  const cssLoaderConfig = [
    'css?modules&camelcase',
    'importLoaders=1',
    `localIdentName=${cssModuleNames}`,
  ].join('&');

  return [cssLoaderConfig, 'postcss'];
}

function htmlWebpackPlugin(minify) {
  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src', 'index.html'),
    inject: 'body',
    minify: minify && {
      collapseWhitespace: true,
    },
  });
}

function productionBuild(base) {
  return merge(base, {
    entry: [
      './src/index.jsx',
    ],
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract(getCssLoaders()) },
      ],
    },
    plugins: [
      ...base.plugins,
      htmlWebpackPlugin(true),
      new ExtractTextPlugin('style.[contenthash:8].css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
        output: {
          comments: false, // Also removes licences
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
    ],
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
  });
}

function addCssLoaders(base) {
  return merge(base, {
    module: {
      loaders: [
        { test: /\.css$/, loaders: getCssLoaders() },
      ],
    },
  });
}

function unitTestConfig(base) {
  return merge.smart(base, {
    entry: [],
    target: 'node',
    module: {
      loaders: [
        { test: /\.css$/, loaders: ['fake-style'] },
      ],
    },
    plugins: [
      ...base.plugins,
      new NodePathReplacePlugin(),
    ],
  });
}

function addStyleLoader(base) {
  return merge.smart(base, {
    module: {
      loaders: [
        { test: /\.css$/, loaders: ['style'] },
      ],
    },
  });
}

function addHotLoaderConfig(base) {
  return merge(base, {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      './src/index.jsx',
    ],
    plugins: [
      ...base.plugins,
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
}

function startConfig(base) {
  return merge(base, {
    plugins: [
      ...base.plugins,
      htmlWebpackPlugin(false),
    ],
  });
}

function addLoadersPlugins(base) {
  const production = process.env.NODE_ENV === 'production';
  const target = process.env.npm_lifecycle_event;

  if (production) {
    return productionBuild(base);
  }

  const withCssLoaders = addCssLoaders(base);
  if (target === 'test') {
    return unitTestConfig(withCssLoaders);
  }

  const withStyleLoader = addStyleLoader(withCssLoaders);
  if (target !== 'storybook') {
    const withHotLoaderConfig = addHotLoaderConfig(withStyleLoader);
    if (target === 'start') {
      return startConfig(withHotLoaderConfig);
    }
    return withHotLoaderConfig;
  }

  return withStyleLoader;
}

function addOutput(base) {
  const target = process.env.npm_lifecycle_event;
  if (target !== 'storybook') {
    return merge(base, {
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash:8].js',
      },
    });
  }
  return base;
}

function buildConfig(base) {
  return [addOutput, addLoadersPlugins].reduce(
    (config, builder) => builder(config),
    base
  );
}

const webpackConfig = buildConfig({
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] },
      { test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[hash:8].[ext]' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.FileAppendPlugin(['/index.css'])
    ),
  ],
  postcss: (webpackEnv) => [
    stylelint,
    postcssImport({
      addDependencyTo: webpackEnv,
    }),
    precss,
  ],
  devServer: {
    stats: 'errors-only',
  },
});

console.log(JSON.stringify(webpackConfig, null, 2));

export default validate(webpackConfig);
