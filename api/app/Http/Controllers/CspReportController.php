<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CspReportController extends Controller
{
    public function report(Request $request): Response
    {
        // Limit to 32kb
        if (strlen($request->getContent()) > 32768) {
            return response()->noContent(413);
        }

        $data = $request->json()->all();

        // Reporting API format (report-to): a list of report objects
        if (array_is_list($data) && $data !== []) {
            /** @var array<int, array<string, mixed>> $data */
            collect($data)
                ->where('type', 'csp-violation')
                ->each(fn (array $entry) => $this->logViolation([
                    'uri' => $entry['url'] ?? 'N/A',
                    'directive' => $entry['body']['effectiveDirective'] ?? 'N/A',
                    'blocked' => $entry['body']['blockedURL'] ?? 'N/A',
                    'disposition' => $entry['body']['disposition'] ?? 'N/A',
                ]));

            return response()->noContent();
        }

        // report-uri format: {"csp-report": {...}}
        $report = $data['csp-report'] ?? null;
        if ($report) {
            $this->logViolation([
                'uri' => $report['document-uri'] ?? 'N/A',
                'directive' => $report['effective-directive'] ?? ($report['violated-directive'] ?? 'N/A'),
                'blocked' => $report['blocked-uri'] ?? 'N/A',
                'disposition' => $report['disposition'] ?? 'N/A',
            ]);

            return response()->noContent();
        }

        return response()->noContent(400);
    }

    /**
     * Log a CSP violation
     *
     * NOTE: Only logs a subset of trimmed fields to avoid
     * log inflation by excessive reporting.
     *
     * @param  array<string,mixed>  $fields
     */
    private function logViolation(array $fields): void
    {
        $trim = fn ($value) => is_string($value) ? mb_strimwidth($value, 0, 3000, '...') : $value;

        Log::warning('CSP Violation', [
            'uri' => $trim($fields['uri']),
            'directive' => $fields['directive'],
            'blocked' => $trim($fields['blocked']),
            'disposition' => $fields['disposition'],
        ]);
    }
}
