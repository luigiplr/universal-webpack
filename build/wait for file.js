'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = wait_for_file;
exports.fs_exists = fs_exists;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Waits for `build/server.js` to be created 
// after Webpack build process finishes.
//
// The Promise is resolved when `build/server.js` has been found 
// (this is needed for development because `webpack-dev-server` 
//  and your Node.js application server are run in parallel,
//  and are restarted simultaneously).
//
function wait_for_file(path) {
	var _this = this;

	// waits for condition to be met, then resolves the promise
	return new _promise2.default(function (resolve) {
		var tick_interval = 300;

		// show the message not too often
		var message_timer = 0;
		var message_interval = 2000; // in milliseconds

		tick((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
			var exists, contents;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return fs_exists(path);

						case 2:
							exists = _context.sent;

							if (exists) {
								_context.next = 5;
								break;
							}

							return _context.abrupt('return', false);

						case 5:

							// Check if the file contents have been written to disk
							// https://github.com/halt-hammerzeit/universal-webpack/issues/24
							contents = _fs2.default.readFileSync(path, 'utf8');

							// Check if the file contents is empty

							if (contents) {
								_context.next = 8;
								break;
							}

							return _context.abrupt('return', false);

						case 8:
							return _context.abrupt('return', true);

						case 9:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		})), tick_interval, resolve, function () {
			message_timer += tick_interval;

			if (message_timer >= message_interval) {
				message_timer = 0;

				console.log('("' + path + '" not found)');
				console.log('(waiting for Webpack build to finish)');
			}
		});
	});
}

function tick(check_condition, interval, done, not_done_yet) {
	check_condition().then(function (condition_is_met) {
		if (condition_is_met) {
			return done();
		}

		not_done_yet();

		setTimeout(function () {
			return tick(check_condition, interval, done, not_done_yet);
		}, interval);
	});
}

// Checks if a filesystem path exists.
// Returns a promise
function fs_exists(path) {
	return new _promise2.default(function (resolve, reject) {
		_fs2.default.exists(path, function (exists) {
			return resolve(exists);
		});
	});
}
//# sourceMappingURL=wait for file.js.map