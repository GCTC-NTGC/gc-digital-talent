/**
 * This javascript file uses Apache Server Side Includes (SSI) to inject server-side environment
 * variables into the frontend.
 * https://httpd.apache.org/docs/current/howto/ssi.html
 *
 * The sjs filetype lets apache know that this file should be parsed for SSI directives.
*/

/* this checks the logout uri value in order to conditionally assign logout uri, this prevents trying to assign undefined to the url */
const OAUTH_LOGOUT_URI_Assign = "<!--#echo var="OAUTH_LOGOUT_URI" -->";
const data = {
        "OAUTH_LOGOUT_URI": OAUTH_LOGOUT_URI_Assign != "(none)" ? OAUTH_LOGOUT_URI_Assign : "",
        "OAUTH_POST_LOGOUT_REDIRECT": "<!--#echo var="OAUTH_POST_LOGOUT_REDIRECT" -->",
    }
window.__SERVER_CONFIG__ = data;
