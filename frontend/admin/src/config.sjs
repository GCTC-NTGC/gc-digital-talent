/**
 * This javascript file uses Apache Server Side Includes (SSI) to inject server-side environment
 * variables into the frontend.
 * https://httpd.apache.org/docs/current/howto/ssi.html
 *
 * The sjs filetype lets apache know that this file should be parsed for SSI directives.
*/

/* this checks the variable values in order to conditionally assign values, this prevents trying to assign empty/none to the url */
const OAUTH_LOGOUT_URI_Assign = "<!--#echo var="OAUTH_LOGOUT_URI" -->";
const OAUTH_POST_LOGOUT_REDIRECT_Assign = "<!--#echo var="OAUTH_POST_LOGOUT_REDIRECT" -->";
const data = {
        "OAUTH_LOGOUT_URI": OAUTH_LOGOUT_URI_Assign != "(none)" ? OAUTH_LOGOUT_URI_Assign : undefined,
        "OAUTH_POST_LOGOUT_REDIRECT": OAUTH_POST_LOGOUT_REDIRECT_Assign != "(none)" ? OAUTH_POST_LOGOUT_REDIRECT_Assign : undefined,
    }
window.__SERVER_CONFIG__ = data;
