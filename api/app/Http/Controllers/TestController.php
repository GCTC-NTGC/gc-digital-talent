<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    public function log(Request $request, string $endpoint, string $dcrImmutableId, $streamName)
    {
        $data = $request->getContent();

        Log::debug(print_r($data, true), [
            $endpoint,
            $dcrImmutableId,
            $streamName,

        ]);

        return response()->noContent();
    }
}
