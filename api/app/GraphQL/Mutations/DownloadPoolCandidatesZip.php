<?php

namespace App\GraphQL\Mutations;

use App\Generators\PoolCandidateZipGenerator;
use App\Jobs\GenerateUserFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadPoolCandidatesZip
{
    /**
     * Dispatches the generation of a
     * csv containing pool candidates
     *
     * @disregard P1003 We never intend to use this
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? [];

        try {
            $generator = new PoolCandidateZipGenerator(
                ids: $ids,
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                fileName: sprintf('%s_%s', __('filename.candidates'), date('Y-m-d_His')),
                dir: $user->id,
                lang: App::getLocale()
            );

            $generator->setUserId($user->id);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting candidate document generation '.$e);

            return false;
        }
    }
}
