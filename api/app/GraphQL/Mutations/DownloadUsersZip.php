<?php

namespace App\GraphQL\Mutations;

use App\Generators\UserZipGenerator;
use App\Jobs\GenerateUserFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadUsersZip
{
    /**
     * Dispatches the generation of a
     * zip containing pool candidates
     *
     * @disregard P1003 We never intend to use this
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? [];

        try {
            $generator = new UserZipGenerator(
                ids: $ids,
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                dir: $user->id,
                fileName: sprintf('%s_%s', __('filename.users'), date('Y-m-d_His')),
                lang: App::getLocale(),
            );

            $generator->setUserId($user->id);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting user document generation '.$e->getMessage());

            return false;
        }

        return false;
    }
}
