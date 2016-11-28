'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.find_style_loaders = find_style_loaders;
exports.parse_loader = parse_loader;
exports.stringify_loader = stringify_loader;
exports.is_style_loader = is_style_loader;
exports.normalize_loaders = normalize_loaders;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Finds module loaders with `style-loader`
function find_style_loaders(configuration) {
	var style_loaders = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(configuration.module.loaders), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var loader = _step.value;

			var loaders = loader.loaders;

			// convert `loader` to `loaders` for convenience
			if (!loader.loaders) {
				if (!loader.loader) {
					throw new Error('No webpack loader specified for this `module.loaders` element');
				}

				// Don't mess with ExtractTextPlugin at all
				// (even though it has `style` loader,
				//  it has its own ways)
				if (loader.loader.indexOf('extract-text-webpack-plugin/loader.js') >= 0) {
					continue;
				}

				if (loader.loader.indexOf('!') >= 0) {
					// Replace `loader` with the corresponding `loaders`
					loader.loaders = loader.loader.split('!');
					delete loader.loader;
				}

				// if (loader.query)
				// {
				// 	loader.loaders[0] += '?' + querystring.stringify(loader.query)
				// 	delete loader.query
				// }
			}

			// Check if this module loader has a `style-loader`
			var style_loader = (loader.loaders || loader.loader.split('!')).filter(is_style_loader)[0];
			if (style_loader) {
				style_loaders.push(loader);
			}
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

	return style_loaders;
}

// Converts loader string into loader info structure
function parse_loader(loader) {
	var name = void 0;
	var query = void 0;

	if ((0, _helpers.is_object)(loader)) {
		name = loader.loader;
		query = loader.query;
	} else {
		name = loader;

		if (name.indexOf('?') >= 0) {
			name = name.substring(0, name.indexOf('?'));
			query = _querystring2.default.parse(loader.substring(loader.indexOf('?') + 1));
		}
	}

	var result = {
		name: name,
		query: query
	};

	return result;
}

// Converts loader info into a string
function stringify_loader(loader) {
	return loader.name + (loader.query ? '?' + _querystring2.default.stringify(loader.query) : '');
}

// Checks if the passed loader is `style-loader`
function is_style_loader(loader) {
	var _parse_loader = parse_loader(loader),
	    name = _parse_loader.name;

	if ((0, _helpers.ends_with)(name, '-loader')) {
		name = name.substring(0, name.lastIndexOf('-loader'));
	}

	return name === 'style';
}

// Converts `loader` to `loaders`
function normalize_loaders(loader) {
	if (!loader.loaders) {
		if (!loader.loader) {
			throw new Error('Neither "loaders" not "loader" are present inside a module loader: ' + _util2.default.inspect(loader));
		}

		if (loader.query) {
			throw new Error('Unable to normalize a module loader with a "query" object: ' + _util2.default.inspect(loader));
		}

		loader.loaders = loader.loader.split('!');
		delete loader.loader;
	}
}
//# sourceMappingURL=loaders.js.map