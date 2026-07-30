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
    ],
];
