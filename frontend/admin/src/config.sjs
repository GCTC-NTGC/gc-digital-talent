/**
 * This javascript file uses Apache Server Side Includes (SSI) to inject server-side environment
 * variables into the frontend.
 * https://httpd.apache.org/docs/current/howto/ssi.html
 *
 * The sjs filetype lets apache know that this file should be parsed for SSI directives.
*/

/*OAUTH_LOGOUT_URI is to be uncommented when testing online*/
const data = {
    /*"OAUTH_LOGOUT_URI": "<!--#echo var="OAUTH_LOGOUT_URI" -->",*/
}

window.__SERVER_CONFIG__ = data;
