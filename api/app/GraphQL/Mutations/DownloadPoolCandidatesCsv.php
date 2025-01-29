<?php

namespace App\GraphQL\Mutations;

use App\Generators\PoolCandidateCsvGenerator;
use App\Jobs\GenerateUserFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadPoolCandidatesCsv
{
    /**
     * Dispatches the generation of a
     * csv containing pool candidates
     *
     * @disregard P1003 We are not going to be using this var
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? null;
        $filters = $args['where'] ?? null;
        $withROD = $args['withROD'] ?? false;

        try {
            $generator = new PoolCandidateCsvGenerator(
                fileName: sprintf('%s_%s', __($withROD ? 'filename.candidates_rod' : 'filename.profiles'), date('Y-m-d_His')),
                dir: $user->id,
                lang: App::getLocale(),
                withROD: $withROD,
            );

            $generator
                ->setUserId($user->id)
                ->setIds($ids)
                ->setFilters($filters);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting candidate csv generation '.$e);

            return false;
        }
    }
}
