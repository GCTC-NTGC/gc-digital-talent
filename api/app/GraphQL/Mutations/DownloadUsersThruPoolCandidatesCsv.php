<?php

namespace App\GraphQL\Mutations;

use App\Generators\UsersThroughPoolCandidatesCsvGenerator;
use App\Jobs\GenerateUserFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadUsersThruPoolCandidatesCsv
{
    /**
     * Dispatches the generation of a
     * csv containing users thru pool candidate model
     *
     * @disregard P1003 We are not going to be using this var
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? null;
        $filters = $args['where'] ?? null;

        try {
            $generator = new UsersThroughPoolCandidatesCsvGenerator(
                fileName: sprintf('%s_%s', __('filename.users'), date('Y-m-d_His')),
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator
                ->setUserId($user->id)
                ->setIds($ids)
                ->setFilters($filters);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting user csv generation '.$e->getMessage());

            return false;
        }
    }
}
