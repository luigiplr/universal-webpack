'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = Chunk_file_names_plugin;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _outputWebpackStats = require('./output webpack stats');

var _outputWebpackStats2 = _interopRequireDefault(_outputWebpackStats);

var _chunks = require('./chunks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Chunk_file_names_plugin(configuration, options) {
	this.configuration = configuration;
	this.options = options;
}

Chunk_file_names_plugin.prototype.apply = function (compiler) {
	// // Webpack configuration
	// // (has wrong `output.path` at this point
	// //  so `output.path` has to be passed when constructing an instance)
	// const webpack_configuration = compiler.options
	var webpack_configuration = this.configuration;

	var options = this.options;

	// chunk filename info file path
	var output_file_path = (0, _chunks.chunk_info_file_path)(webpack_configuration, options.chunk_info_filename);

	// when all is done
	// https://github.com/webpack/docs/wiki/plugins
	compiler.plugin('done', function (stats) {
		var json = stats.toJson({
			context: webpack_configuration.context,

			// Add built modules information to chunk information.
			// What for is it here? I don't know. It's a copy & paste from the Webpack author's code.
			chunkModules: true

		});

		// output some info to the console if in development mode
		if (!options.silent) {}
		// outputs stats info to the console
		// (only needed in development mode)
		// output_webpack_stats(stats, json)


		// "publicPath" (will be prepended to chunk file names)
		var assets_base_url = webpack_configuration.devServer && webpack_configuration.devServer.publicPath ? webpack_configuration.devServer.publicPath : json.publicPath;

		// Generate chunk filename info
		var chunk_filename_info = filename_info(json, assets_base_url);

		// Write chunk filename info to disk
		_fsExtra2.default.outputFileSync(output_file_path, (0, _stringify2.default)(chunk_filename_info));
	});
};

// Generates chunk filename info
// (`assets_base_url` will be prepended to chunk file names)
function filename_info(json, assets_base_url) {
	var assets_by_chunk = json.assetsByChunkName;

	var assets_chunks = {
		javascript: {},
		styles: {}
	};

	// gets asset paths by name and extension of their chunk
	function get_assets(name, extension) {
		var chunk = json.assetsByChunkName[name];

		// a chunk could be a string or an array, so make sure it is an array
		if (!Array.isArray(chunk)) {
			chunk = [chunk];
		}

		return chunk
		// filter by extension
		.filter(function (name) {
			return _path2.default.extname(name) === '.' + extension;
		})
		// adjust the real path (can be http, filesystem)
		.map(function (name) {
			return assets_base_url + name;
		});
	}

	// for each chunk name ("main", "common", ...)
	(0, _keys2.default)(assets_by_chunk).forEach(function (name) {
		// log.debug(`getting javascript and styles for chunk "${name}"`)

		// get javascript chunk real file path

		var javascript = get_assets(name, 'js')[0];
		// the second asset is usually a source map

		if (javascript) {
			// log.debug(` (got javascript)`)
			assets_chunks.javascript[name] = javascript;
		}

		// get style chunk real file path

		var style = get_assets(name, 'css')[0];
		// the second asset is usually a source map

		if (style) {
			// log.debug(` (got style)`)
			assets_chunks.styles[name] = style;
		}
	});

	return assets_chunks;
}
module.exports = exports['default'];
//# sourceMappingURL=chunks plugin.js.map