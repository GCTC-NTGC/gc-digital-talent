/**
 * This javascript file uses Apache Server Side Includes (SSI) to inject server-side environment
 * variables into the frontend.
 * https://httpd.apache.org/docs/current/howto/ssi.html
 *
 * The sjs filetype lets apache know that this file should be parsed for SSI directives.
*/

// catch the placeholder string that Apache uses to indicate that the variable is missing
const filterEmpty = (value) => value != "(none)" ? value : undefined;

const data = new Map([
    ["OAUTH_LOGOUT_URI", filterEmpty("<!--#echo var="OAUTH_LOGOUT_URI" -->")],
    ["OAUTH_POST_LOGOUT_REDIRECT", filterEmpty("<!--#echo var="OAUTH_POST_LOGOUT_REDIRECT" -->")],
]);

window.__SERVER_CONFIG__ = data;
