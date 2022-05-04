/**
 * This javascript file uses Apache Server Side Includes (SSI) to inject server-side environment
 * variables into the frontend.
 * https://httpd.apache.org/docs/current/howto/ssi.html
 *
 * The sjs filetype lets apache know that this file should be parsed for SSI directives.
 */

const data = new Map([
    ["OAUTH_LOGOUT_URI", "<!--#echo var="OAUTH_LOGOUT_URI" -->"],
    ["OAUTH_POST_LOGOUT_REDIRECT", "<!--#echo var="OAUTH_POST_LOGOUT_REDIRECT" -->"],
]);

window.__SERVER_CONFIG__ = data;
