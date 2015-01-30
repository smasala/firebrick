/*!
 * Firebrick Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define("configuration",[],function(){var e=window._fbBowerPath||"../bower_components";return require.config({paths:{jquery:e+"/jquery/dist/jquery",knockout:e+"/knockoutjs/dist/knockout.debug","knockout-mapping":e+"/knockout-mapping/knockout.mapping",firebrick:e+"/firebrick/dist/firebrick"},shim:{"knockout-mapping":["knockout"]}})});