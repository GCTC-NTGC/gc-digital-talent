<?php

namespace App\GraphQL\Mutations;

use App\Jobs\GenerateCandidateCSV;
use App\Models\PoolCandidate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadPoolCandidatesCsv
{
    /**
     * Dispatches the generation of a
     * csv containing pool candidates
     */
    public function __invoke($_, array $args)
    {

        $userId = Auth::id();
        throw_unless(is_string($userId), UnauthorizedException::class);

        $locale = $args['locale'] ?? 'en';

        try {
            // Make sure this user can see candidates before sending
            // them to the generation job
            $ids = PoolCandidate::whereIn('id', $args['ids'])
                ->authorizedToView()
                ->get('id')
                ->pluck('id') // Seems weird but we are just flattening it out
                ->toArray();

            GenerateCandidateCSV::dispatch($ids, $userId, strtolower($locale));

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting candidate csv generation '.$e->getMessage());

            return false;
        }

        return false;
    }
}
