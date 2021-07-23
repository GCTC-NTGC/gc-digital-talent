<?php

if (! function_exists('subdirAsset')) {
    function subdirAsset($path) {
        return asset(env('APP_DIR')."/".$path);
    }
}

if (! function_exists('subdirMix')) {
    function subdirMix($path) {
        return mix(env('APP_DIR')."/".$path);
    }
}
