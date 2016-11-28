'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = server_configuration;
exports.is_external = is_external;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _validateNpmPackageName = require('validate-npm-package-name');

var _validateNpmPackageName2 = _interopRequireDefault(_validateNpmPackageName);

var _helpers = require('./helpers');

var _loaders = require('./loaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tunes the client-side Webpack configuration for server-side build
function server_configuration(webpack_configuration, settings) {
	if (!webpack_configuration.context) {
		throw new Error('You must set "context" parameter in your Webpack configuration');
	}

	var configuration = (0, _helpers.clone)(webpack_configuration);

	// (without extension)
	var output_file_name = _path2.default.basename(settings.server.output, _path2.default.extname(settings.server.output));

	configuration.entry = (0, _defineProperty3.default)({}, output_file_name, settings.server.input);

	// https://webpack.github.io/docs/configuration.html#target
	configuration.target = 'node';

	// Tell Webpack to leave `__dirname` and `__filename` unchanged
	// https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
	configuration.node = {
		__dirname: false,
		__filename: false
	};

	// https://webpack.github.io/docs/configuration.html#output-librarytarget
	configuration.output.libraryTarget = 'commonjs2';

	// No need for browser cache management, so disable hashes in filenames
	configuration.output.filename = '[name].js';
	configuration.output.chunkFilename = '[name].js';

	// Include comments with information about the modules.
	// require(/* ./test */23).
	// What for is it here? I don't know. It's a copy & paste from the Webpack author's code.
	configuration.output.pathinfo = true;

	// Output server bundle into its own directory
	configuration.output.path = _path2.default.resolve(configuration.context, _path2.default.dirname(settings.server.output));

	// Output "*.map" file for human-readable stack traces
	configuration.devtool = 'source-map';

	// https://webpack.github.io/docs/configuration.html#externals
	//
	// `externals` allows you to specify dependencies for your library 
	// that are not resolved by webpack, but become dependencies of the output. 
	// This means they are imported from the environment during runtime.
	//
	// So that Webpack doesn't bundle "node_modules" into server.js.

	configuration.externals = configuration.externals || [];

	configuration.externals.push(function (context, request, callback) {
		if (is_external(request, configuration, settings)) {
			// Resolve dependency as external
			return callback(null, request);
		}

		// Resolve dependency as non-external
		return callback();
	});

	// Replace `style-loader` with `fake-style-loader`
	// since it's no web browser
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)((0, _loaders.find_style_loaders)(configuration)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var loader = _step.value;

			var style_loader = loader.loaders.filter(_loaders.is_style_loader)[0];

			// Copy `style-loader` configuration
			var fake_style_loader = (0, _loaders.parse_loader)(style_loader);

			// Since npm v3 enforces flat `node_modules` structure,
			// `fake-style-loader` is gonna be right inside `node_modules`
			fake_style_loader.name = 'fake-style-loader';
			// fake_style_loader.name = path.resolve(__dirname, '../node_modules/fake-style-loader')

			// Replace the loader
			loader.loaders[loader.loaders.indexOf(style_loader)] = (0, _loaders.stringify_loader)(fake_style_loader);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	configuration.plugins = configuration.plugins || [];

	// Remove HotModuleReplacementPlugin and CommonsChunkPlugin
	configuration.plugins = configuration.plugins.filter(function (plugin) {
		return plugin.constructor !== _webpack2.default.HotModuleReplacementPlugin && plugin.constructor !== _webpack2.default.optimize.CommonsChunkPlugin;
	});

	// Add a couple of utility plugins
	configuration.plugins = configuration.plugins.concat(
	// Resorted from using it here because
	// if the `build/server` folder is not there
	// when Nodemon starts then it simply won't detect 
	// updates of the server-side bundle
	// and therefore won't restart on code changes.
	//
	// `build/server` folder needs to be present
	// by the time Nodemon starts,
	// and that's accomplished with a separate npm script.

	// // Cleans the output folder
	// new clean_plugin([path.dirname(settings.server.output)],
	// {
	// 	root: configuration.context
	// }),

	// Put the resulting Webpack compiled code into a sigle javascript file
	// (doesn't disable CommonsChunkPlugin)
	new _webpack2.default.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));

	// Done
	return configuration;
}

// Checks if a require()d dependency is external
function is_external(request, webpack_configuration, settings) {
	// Mark `node_modules` as external.

	var package_name = request;
	if (package_name.indexOf('/') >= 0) {
		package_name = package_name.substring(0, package_name.indexOf('/'));
	}

	// Skip webpack loader specific require()d paths
	// https://webpack.github.io/docs/loaders.html
	if ((0, _helpers.starts_with)(package_name, '!') || (0, _helpers.starts_with)(package_name, '-!')) {
		// The dependency is not external
		return false;
	}

	// If it's not a module require call,
	// then resolve it as non-external.
	//
	// https://github.com/npm/validate-npm-package-name
	//
	if (!(0, _validateNpmPackageName2.default)(package_name).validForNewPackages) {
		// The dependency is not external
		return false;
	}

	// If any aliases are specified, then resolve those aliases as non-external
	if (webpack_configuration.resolve && webpack_configuration.resolve.alias) {
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(webpack_configuration.resolve.alias)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var alias = _step2.value;

				// if (request === key || starts_with(request, key + '/'))
				if (package_name === alias) {
					// The module is not external
					return false;
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	}

	// Skip modules explicitly ignored by the user
	if (settings.exclude_from_externals) {
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = (0, _getIterator3.default)(settings.exclude_from_externals), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var exclusion_pattern = _step3.value;

				var regexp = exclusion_pattern;

				if (typeof exclusion_pattern === 'string') {
					if (request === exclusion_pattern || (0, _helpers.starts_with)(request, exclusion_pattern + '/')) {
						// The module is not external
						return false;
					}
				} else if (exclusion_pattern instanceof RegExp) {
					if (regexp.test(request)) {
						// The module is not external
						return false;
					}
				} else {
					throw new Error('Invalid exclusion pattern: ' + exclusion_pattern + '. Only strings and regular expressions are allowed.');
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	}

	// The module is external
	return true;
}
//# sourceMappingURL=server configuration.js.map