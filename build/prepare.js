'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = prepare;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creates (or cleans) the server-side build folder.
//
// That's needed because Nodemon, for example,
// needs the folder to exist by the time it runs,
// otherwise it won't detect any changes to the code
// and therefore won't restart on code changes.
//
function prepare(settings, webpack_configuration) {
	if (!webpack_configuration.context) {
		throw new Error('Base folder not specified');
	}

	if (!settings.server.output) {
		throw new Error('`settings.server.output` not specified');
	}

	var server_build_bundle_path = _path2.default.resolve(webpack_configuration.context, settings.server.output);
	var server_build_folder = _path2.default.dirname(server_build_bundle_path);

	// Extra caution to prevent data loss
	if (server_build_folder === _path2.default.normalize(webpack_configuration.context)) {
		throw new Error('`settings.server.output` "' + server_build_folder + '" points to the project root folder. Won\'t clear that folder to prevent accidental data loss.');
	}

	// Extra caution to prevent data loss
	if (server_build_folder.indexOf(webpack_configuration.context) !== 0) {
		throw new Error('`settings.server.output` "' + server_build_folder + '" points outside of the project root folder "' + webpack_configuration.context + '". Won\'t clear that folder to prevent accidental data loss');
	}

	_fsExtra2.default.emptyDirSync(server_build_folder);
}
module.exports = exports['default'];
//# sourceMappingURL=prepare.js.map