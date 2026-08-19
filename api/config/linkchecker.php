<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Web source path
    |--------------------------------------------------------------------------
    |
    | The directory scanned for external links (apps/web/src, a sibling of
    | this Laravel app rather than a path within it).
    |
    */

    'web_src_path' => env('LINK_CHECKER_WEB_SRC_PATH', base_path('../apps/web/src')),

    /*
    |--------------------------------------------------------------------------
    | Blocklisted domains
    |--------------------------------------------------------------------------
    |
    | Domains that should not be checked. Links starting with any of these
    | are excluded from the collected list.
    |
    */

    'blocklisted_domains' => [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://gcxgce.sharepoint.com',
        'http://localhost',
        // Sits behind Cloudflare + Kasada bot-detection (JS/TLS-fingerprint
        // challenge), so it always 403s a plain HTTP client even though the
        // page is live for real visitors. Confirmed 2026-07-30.
        'https://srvcanadavrs.ca',
    ],

    /*
    |--------------------------------------------------------------------------
    | Timeout
    |--------------------------------------------------------------------------
    |
    | Seconds to wait for a response before considering a link unreachable.
    |
    */

    'timeout' => env('LINK_CHECKER_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Concurrency
    |--------------------------------------------------------------------------
    |
    | Number of links to check at the same time.
    |
    */

    'concurrency' => env('LINK_CHECKER_CONCURRENCY', 10),

    /*
    |--------------------------------------------------------------------------
    | Browser User-Agent hosts
    |--------------------------------------------------------------------------
    |
    | These hosts return 404 to any request without a realistic browser
    | User-Agent string (confirmed via curl testing 2026-07-30 — no other
    | header makes a difference). Requests to these hosts use the browser
    | user agent below instead of the identifying default one.
    |
    */

    'browser_user_agent_hosts' => [
        'connexion.canada.ca',
        'login.canada.ca',
        'laws-lois.justice.gc.ca',
    ],

    /*
    |--------------------------------------------------------------------------
    | User agents
    |--------------------------------------------------------------------------
    |
    | The default identifies this tool. The browser one is only used for
    | the hosts listed in browser_user_agent_hosts above.
    |
    */

    'user_agent' => 'Mozilla/5.0 (compatible; LinkChecker/1.0; +https://github.com/GCTC-NTGC/gc-digital-talent)',

    'browser_user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
];
