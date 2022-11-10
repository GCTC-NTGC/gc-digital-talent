/**
 * This file is dynamically updated on deployment or docker image instantiation to send some variables to the client
 */

const data = new Map([
    ["OAUTH_POST_LOGOUT_REDIRECT", "http://localhost:8000/logged-out"],

    // Mock auth endpoint
    ["OAUTH_LOGOUT_URI", "http://localhost:8000/oxauth/endsession"],

    // SiC endpoint (will break e2e tests)
    //["OAUTH_LOGOUT_URI", "https://te-auth.id.tbs-sct.gc.ca/oxauth/restv1/end_session"],

    // Feature flags
    ["FEATURE_DIRECTINTAKE", "true"],
    ["FEATURE_APPLICANTSEARCH", "true"],

    // Azure application insights not used in dev
    ["APPLICATIONINSIGHTS_CONNECTION_STRING", ""],
]);

window.__SERVER_CONFIG__ = data;
