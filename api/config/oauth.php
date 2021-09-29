<?php

return [
    /**
     * The OAuth server's public credentials which we can use to verify tokens are from the expected server.
     */
    'public_key' => env('AUTH_SERVER_PUBLIC_KEY', ''),
    'iss' => env('AUTH_SERVER_ISS', ''),
];
