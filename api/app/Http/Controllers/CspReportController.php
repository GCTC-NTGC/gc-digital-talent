<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CspReportController extends Controller
{
    public function report(Request $request)
    {
        $report = $request->json()->all();
        $message = sprintf(
            'CSP violation, %s',
            json_encode($report)
        );

        Log::warning($message);
    }
}
