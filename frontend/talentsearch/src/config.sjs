/**
 * This javascript file uses Apache Server Side Includes (SSI) to inject server-side environment
 * variables into the frontend.
 * https://httpd.apache.org/docs/current/howto/ssi.html
 *
 * The sjs filetype lets apache know that this file should be parsed for SSI directives.
 */

const data = new Map([
    ["FEATURE_APPLICANTPROFILE", "<!--#echo var="FEATURE_APPLICANTPROFILE" -->"],
]);

window.__SERVER_CONFIG__ = data;
