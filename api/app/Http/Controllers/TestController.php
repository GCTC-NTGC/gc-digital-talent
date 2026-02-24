<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    public function log(Request $request)
    {
        $data = $request->getContent();

        Log::debug(print_r($data, true));

        return response()->noContent();
    }
}
