/**
 * This file is dynamically updated on deployment or docker image instantiation to send some variables to the client
 */

// only take the string if the variable has been replaced
const takeReplacedVariable = (value) => !value.startsWith('$') ? value : undefined;

const data = new Map([
    ["OAUTH_POST_LOGOUT_REDIRECT", takeReplacedVariable("$OAUTH_POST_LOGOUT_REDIRECT")],
    ["OAUTH_LOGOUT_URI", takeReplacedVariable("$OAUTH_LOGOUT_URI")],
    ["FEATURE_DIRECTINTAKE", takeReplacedVariable("$FEATURE_DIRECTINTAKE")],
    ["FEATURE_APPLICANTSEARCH", takeReplacedVariable("$FEATURE_APPLICANTSEARCH")],
    ["APPLICATIONINSIGHTS_CONNECTION_STRING", takeReplacedVariable("$APPLICATIONINSIGHTS_CONNECTION_STRING")],
]);

window.__SERVER_CONFIG__ = data;
