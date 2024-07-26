<?php

namespace App\GraphQL\Mutations;

use App\Generators\PoolCandidateCsvGenerator;
use App\Jobs\GenerateUserFile;
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

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $locale = $args['locale'] ?? 'en';

        try {
            // Make sure this user can see candidates before sending
            // them to the generation job
            $ids = PoolCandidate::whereIn('id', $args['ids'])
                ->authorizedToView()
                ->get('id')
                ->pluck('id') // Seems weird but we are just flattening it out
                ->toArray();

            $fileName = 'candidates_'.date('Y-m-d_His').'.csv';

            $generator = new PoolCandidateCsvGenerator(
                ids: $ids,
                fileName: $fileName,
                dir: $user->id,
                lang: strtolower($locale),
            );

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting candidate csv generation '.$e->getMessage());

            return false;
        }

        return false;
    }
}
