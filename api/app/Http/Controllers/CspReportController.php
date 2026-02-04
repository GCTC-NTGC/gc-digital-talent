<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CspReportController extends Controller
{
    public function report(Request $request)
    {
        // Limit to 32kb
        if (strlen($request->getContent()) > 32768) {
            return response()->noContent(413);
        }

        $data = $request->json()->all();
        $report = $data['csp-report'] ?? null;

        // Do not log anything if we don't have a report
        if (! $report) {
            return response()->noContent(400);
        }

        // Trim fields before logging
        $trim = fn ($value) => is_string($value) ? mb_strimwidth($value, 0, 3000, '...') : $value;

        // Only log keys we care about, prevent artificial inflation
        $logData = [
            'uri' => $trim($report['document-uri'] ?? 'N/A'),
            'directive' => $report['effective-directive'] ?? ($report['violated-directive'] ?? 'N/A'),
            'blocked' => $trim($report['blocked-uri'] ?? 'N/A'),
            'disposition' => $report['disposition'] ?? 'N/A',
        ];

        Log::warning('CSP Violation', $logData);

        return response()->noContent();
    }
}
