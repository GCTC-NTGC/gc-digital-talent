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
            'CSP violation, %s, %s, %s',
            $report['csp-report']['blocked-uri'] ?? '',
            $report['csp-report']['column-number'] ?? '',
            json_encode($report['csp-report'])
        );

        Log::warning($message);
    }
}
