'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = devtools;
// The following code is an advanced topic
// and can be skipped safely.
// This code is not required
// for the whole thing to work.
// It's gonna work fine without this code.
//
// (in development mode)
//
// Removing the now unnecessary `<link rel="stylesheet"/>` tag,
// because the client-side javascript has already kicked-in
// and added all the styles using `style-loader` dynamically.
//
// Should that stylesheet be removed at all?
// Not necessarily.
// It's just, for example, if a developer opens the page,
// then decides to remove some CSS class,
// and switches back to the browser,
// and the CSS class is still there,
// because it was only removed from dynamically added CSS styles,
// not the statically added ones on the server-side.
//
function devtools(parameters) {
	var chunks = parameters.chunks();

	var style_url = chunks.styles[parameters.entry];
	var common_style_url = chunks.styles.common;

	var get_style_link_element_script = function get_style_link_element_script(url) {
		return 'document.querySelector(\'head > link[rel="stylesheet"][href="' + url + '"]\')';
	};

	var script = '\n\t\tdocument.addEventListener(\'DOMContentLoaded\', function(event)\n\t\t{\n\t\t\t// The style-loader has already added <link/>s \n\t\t\t// to its dynamic hot-reloadable styles,\n\t\t\t// so remove the <link/> to the static CSS bundle\n\t\t\t// inserted during server side page rendering.\n\t\t\t\n\t\t\tvar stylesheet\n\t\t\tvar common_stylesheet\n\n\t\t\t' + (style_url ? 'stylesheet        = ' + get_style_link_element_script(style_url) : '') + '\n\t\t\t' + (common_style_url ? 'common_stylesheet = ' + get_style_link_element_script(common_style_url) : '') + '\n\n\t\t\t// Waits a "magical" time amount of one second\n\t\t\t// for the dynamically added stylesheets\n\t\t\t// to be parsed and applied to the page.\n\t\t\tsetTimeout(function()\n\t\t\t{\n\t\t\t\tstylesheet        && stylesheet.parentNode.removeChild(stylesheet)\n\t\t\t\tcommon_stylesheet && common_stylesheet.parentNode.removeChild(common_stylesheet)\n\t\t\t},\n\t\t\t1000)\n\t\t})\n\t';

	return script;
}
module.exports = exports['default'];
//# sourceMappingURL=devtools.js.map