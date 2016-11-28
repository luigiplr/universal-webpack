'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = server;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _waitForFile = require('./wait for file');

var _waitForFile2 = _interopRequireDefault(_waitForFile);

var _chunks = require('./chunks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function server(webpack_configuration, settings) {
	if (!webpack_configuration.context) {
		throw new Error('You must set "context" parameter in your Webpack configuration');
	}

	// Path to `build/server.js`
	// (built by Webpack)
	var server_bundle_path = _path2.default.resolve(webpack_configuration.context, settings.server.output);

	// waits for the first Webpack server-side build to finish and produce `webpage_rendering_server.js`
	return (0, _waitForFile2.default)(server_bundle_path).then(function () {
		var chunk_info_json_file_path = (0, _chunks.chunk_info_file_path)(webpack_configuration, settings.chunk_info_filename);

		// Will be passed to the server code
		var additional = {
			chunks: function chunks() {
				// clear Webpack require() cache for hot reload in development mode
				if (process.env.NODE_ENV === 'development') {
					delete require.cache[chunk_info_json_file_path];
				}

				return require(chunk_info_json_file_path);
			}
		};

		// Start webpage rendering server
		// (this module will be compiled by Webpack server-side build from './source/server.js')

		var starter = require(server_bundle_path);

		// Fixing Babel `module.exports.default` issues

		if (typeof starter === 'function') {
			return starter(additional);
		}

		if (typeof starter.default === 'function') {
			return starter.default(additional);
		}

		var stringified_starter = String(starter);
		if (stringified_starter === '[object Object]') {
			stringified_starter = (0, _stringify2.default)(starter, null, 2);
		}

		throw new Error('[universal-webpack] Your server source file must export a function. ' + ('Got ' + _util2.default.inspect(starter)));
	}).catch(function (error) {
		// bright red color
		console.log("\x1b[1m\x1b[31m");

		// Output the error stack trace
		console.error('\n' + (error.stack || error));

		// reset color and brightness
		console.log('\x1b[39m\x1b[22m');

		// exit with non-zero exit code (indicating that an error happened)
		process.exit(1);
	});
}
module.exports = exports['default'];
//# sourceMappingURL=server.js.map