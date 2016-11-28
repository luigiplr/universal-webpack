'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = client_configuration;

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _chunksPlugin = require('./chunks plugin');

var _chunksPlugin2 = _interopRequireDefault(_chunksPlugin);

var _helpers = require('./helpers');

var _loaders = require('./loaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function client_configuration(webpack_configuration, settings) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var configuration = (0, _helpers.clone)(webpack_configuration);

	configuration.plugins = configuration.plugins || [];

	configuration.plugins.push(
	// Add chunk filename info plugin
	//
	// Writes client-side build chunks filename info
	// for later use inside server-side rendering code
	// (`<script src=.../>` and `<link rel="style" href=.../>` tags)
	//
	// Cloning Webpack configuration here
	// because `webpack-dev-server` seems to alter it
	// by changing the already predefined `.output.path`.
	//
	new _chunksPlugin2.default((0, _helpers.clone)(configuration), { silent: settings.silent, chunk_info_filename: settings.chunk_info_filename }));

	// Not sure about the name yet
	// // Normalize legacy options
	// if (options.css_bundle)
	// {
	// 	console.warn("`css_bundle` option is now called `extract_styles`")
	// 	options.extract_styles = options.css_bundle
	// 	delete options.css_bundle
	// }

	// If it's a client-side development webpack build,
	// and CSS bundle extraction is enabled,
	// then extract all CSS styles into a file.
	// (without removing them from the code)
	if (options.development && options.css_bundle) {
		var css_bundle_filename = '[name]-[contenthash].css';

		if (typeof options.css_bundle === 'string') {
			css_bundle_filename = options.css_bundle;
		}

		// Extract styles into a file
		// (without removing them from the code in this case).
		//
		// It copies contents of each `require("style.css")`
		// into one big CSS file on disk
		// which will be later read on the server-side
		// and inserted into `<head><style></style></head>`,
		// so that in development mode there's no
		// "flash of unstyled content" on page reload.
		//
		// "allChunks: true" option means that the styles from all chunks
		// (think "entry points") will be extracted into a single big CSS file.
		//
		var extract_css = extract_text_plugin_instance(css_bundle_filename, { allChunks: true });

		// Find module loaders with `style-loader`,
		// and set those module loaders to `extract-text-webpack-plugin` loader
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = (0, _getIterator3.default)((0, _loaders.find_style_loaders)(configuration)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var loader = _step.value;

				(0, _loaders.normalize_loaders)(loader);

				var style_loader = loader.loaders.filter(_loaders.is_style_loader)[0];

				var before_style_loader = loader.loaders.slice(0, loader.loaders.indexOf(style_loader));
				var after_style_loader = loader.loaders.slice(loader.loaders.indexOf(style_loader) + 1);

				// The first argument to the .extract() function is the name of the loader
				// ("style-loader" in this case) to be applied to non-top-level-chunks in case of "allChunks: false" option.
				// since in this configuration "allChunks: true" option is used, this first argument is irrelevant.
				//
				// `remove: false` ensures that the styles being extracted
				// aren't erased from the chunk javascript file.
				//
				// I'm also prepending another `style-loader` here
				// to re-enable adding these styles to the <head/> of the page on-the-fly.
				//
				loader.loader = 'style-loader!' + extract_text_plugin_extract(extract_css, before_style_loader, after_style_loader, { remove: false });
				delete loader.loaders;
			}

			// Add the `extract-text-webpack-plugin` to the list of plugins.
			// It will extract all CSS into a file
			// (without removing it from the code in this case)
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

		configuration.plugins.push(extract_css);
	}

	// Use `extract-text-webpack-plugin`
	// to extract all CSS into a separate file
	// (in production)
	if (options.development === false && options.css_bundle !== false) {
		var _css_bundle_filename = '[name]-[contenthash].css';

		if (typeof options.css_bundle === 'string') {
			_css_bundle_filename = options.css_bundle;
		}

		// Extract styles into a file
		// (removing them from the code in this case).
		//
		// It moves contents of each `require("style.css")`
		// into one big CSS file on disk
		// which will be later read on the server-side
		// and inserted into `<head><style></style></head>`.
		//
		// "allChunks: true" option means that the styles from all chunks
		// (think "entry points") will be extracted into a single big CSS file.
		//
		var _extract_css = extract_text_plugin_instance(_css_bundle_filename, { allChunks: true });

		// Find module loaders with `style-loader`,
		// and set those module loaders to `extract-text-webpack-plugin` loader
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = (0, _getIterator3.default)((0, _loaders.find_style_loaders)(configuration)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var _loader = _step2.value;

				(0, _loaders.normalize_loaders)(_loader);

				var _style_loader = _loader.loaders.filter(_loaders.is_style_loader)[0];

				var style_loader_and_before = _loader.loaders.slice(0, _loader.loaders.indexOf(_style_loader) + 1);
				var _after_style_loader = _loader.loaders.slice(_loader.loaders.indexOf(_style_loader) + 1);

				// The first argument to the .extract() function is the name of the loader
				// ("style-loader" in this case) to be applied to non-top-level-chunks in case of "allChunks: false" option.
				// since in this configuration "allChunks: true" option is used, this first argument is irrelevant.
				//
				_loader.loader = extract_text_plugin_extract(_extract_css, style_loader_and_before, _after_style_loader);
				delete _loader.loaders;
			}

			// Add the `extract-text-webpack-plugin` to the list of plugins.
			// It will extract all CSS into a file
			// (removing it from the code in this case)
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

		configuration.plugins.push(_extract_css);
	}

	// Done
	return configuration;
}

// Supports both v1 and v2 of `extract-text-webpack-plugin`
function extract_text_plugin_instance(filename) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var plugin = void 0;

	try {
		plugin = new _extractTextWebpackPlugin2.default(filename, options);
	} catch (error) {
		if ((0, _helpers.starts_with)(error.message, 'Breaking change: ExtractTextPlugin now only takes a single argument.')) {
			plugin = new _extractTextWebpackPlugin2.default((0, _extends3.default)({}, options, { filename: filename }));
		} else {
			throw error;
		}
	}

	return plugin;
}

// Supports both v1 and v2 of `extract-text-webpack-plugin`
function extract_text_plugin_extract(plugin, fallbackLoader, loader) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	var result = void 0;

	try {
		result = plugin.extract(fallbackLoader, loader, options);
	} catch (error) {
		if ((0, _helpers.starts_with)(error.message, 'Breaking change: extract now only takes a single argument.')) {
			result = plugin.extract((0, _extends3.default)({}, options, { fallbackLoader: fallbackLoader, loader: loader }));
		} else {
			throw error;
		}
	}

	return result;
}
module.exports = exports['default'];
//# sourceMappingURL=client configuration.js.map