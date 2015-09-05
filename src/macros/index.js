/*!
 * Interfaces for SweetJS macros
 */

/**
 * Defines a module
 *
 * @param {string} name - module name
 * @return {{extends: function(string): {dependencies: function(...string)}, dependencies: function(...string)}}
 */
global.package = function (name) {};
