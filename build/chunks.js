'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.chunk_info_file_path = chunk_info_file_path;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chunk_info_file_path(webpack_configuration, chunk_info_filename) {
	return _path2.default.join(webpack_configuration.output.path, chunk_info_filename || 'webpack-chunks.json');
}
//# sourceMappingURL=chunks.js.map