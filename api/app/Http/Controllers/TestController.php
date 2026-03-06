<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/* This controller can be used for manual testing.  It should never be used in production */
class TestController extends Controller
{
    public function log(Request $request)
    {
        $data = $request->getContent();

        Log::debug(print_r($data, true));

        return response()->noContent();
    }
}
